package com.pibanhotosa.services;

import com.pibanhotosa.dto.AgendamentoRequest;
import com.pibanhotosa.dto.AgendamentoResponse;
import com.pibanhotosa.dto.CancelamentoRequest;
import com.pibanhotosa.dto.ConclusaoRequest;
import com.pibanhotosa.dto.PetResponse;
import com.pibanhotosa.dto.ReagendamentoRequest;
import com.pibanhotosa.dto.UsuarioResponse;
import com.pibanhotosa.entities.Agendamento;
import com.pibanhotosa.entities.Animal;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.Role;
import com.pibanhotosa.enums.StatusAgendamento;
import com.pibanhotosa.exceptions.BusinessException;
import com.pibanhotosa.exceptions.NotFoundException;
import com.pibanhotosa.repositories.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class AgendamentoService {

    private static final Set<StatusAgendamento> STATUS_ATIVOS = Set.of(
            StatusAgendamento.AGENDADO,
            StatusAgendamento.CONFIRMADO,
            StatusAgendamento.CONCLUIDO
    );

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioService usuarioService;
    private final AnimalService animalService;
    private final int horaInicio;
    private final int horaFim;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                              UsuarioService usuarioService,
                              AnimalService animalService,
                              @Value("${app.schedule.start-hour}") int horaInicio,
                              @Value("${app.schedule.end-hour}") int horaFim) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioService = usuarioService;
        this.animalService = animalService;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }

    @Transactional
    public AgendamentoResponse criar(Long clienteId, AgendamentoRequest request) {
        Usuario cliente = usuarioService.buscarPorId(clienteId);
        if (cliente.getRole() != Role.CLIENTE) {
            throw new BusinessException("Somente clientes podem criar agendamentos");
        }

        Usuario profissional = usuarioService.buscarProfissionalPadrao();
        Animal animal = animalService.buscarEntidade(clienteId, request.animalId());

        Duration duracao = request.tipoServico().getDuracao();
        validarData(request.dataHora(), duracao);
        garantirDisponibilidade(profissional.getId(), request.dataHora(), duracao, null);

        Agendamento agendamento = Agendamento.builder()
                .cliente(cliente)
                .profissional(profissional)
                .animal(animal)
                .tipoServico(request.tipoServico())
                .dataHora(request.dataHora())
                .duracaoMinutos((int) duracao.toMinutes())
                .observacoesCliente(request.observacoesCliente())
                .status(StatusAgendamento.AGENDADO)
                .build();

        return toResponse(agendamentoRepository.save(agendamento));
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorCliente(Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByDataHoraAsc(clienteId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorProfissional(Long profissionalId) {
        return agendamentoRepository.findByProfissionalIdOrderByDataHoraAsc(profissionalId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AgendamentoResponse cancelar(Long clienteId, Long agendamentoId, CancelamentoRequest request) {
        Agendamento agendamento = agendamentoRepository.findByIdAndClienteId(agendamentoId, clienteId)
                .orElseThrow(() -> new NotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Este agendamento já foi cancelado");
        }
        if (agendamento.getStatus() == StatusAgendamento.CONCLUIDO) {
            throw new BusinessException("Não é possível cancelar um agendamento concluído");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        String observacoes = agendamento.getObservacoesCliente();
        String anotacaoCancelamento = "Cancelado pelo cliente: " + request.motivo();
        agendamento.setObservacoesCliente(observacoes == null ? anotacaoCancelamento : observacoes + "\n" + anotacaoCancelamento);
        agendamento.setConcluidoEm(null);

        return toResponse(agendamento);
    }

    @Transactional
    public AgendamentoResponse reagendar(Long clienteId, Long agendamentoId, ReagendamentoRequest request) {
        Agendamento agendamento = agendamentoRepository.findByIdAndClienteId(agendamentoId, clienteId)
                .orElseThrow(() -> new NotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Agendamentos cancelados não podem ser reagendados");
        }
        if (agendamento.getStatus() == StatusAgendamento.CONCLUIDO) {
            throw new BusinessException("Agendamentos concluídos não podem ser reagendados");
        }

        Duration duracao = agendamento.getTipoServico().getDuracao();
        validarData(request.novaDataHora(), duracao);
        garantirDisponibilidade(agendamento.getProfissional().getId(), request.novaDataHora(), duracao, agendamento.getId());

        agendamento.setDataHora(request.novaDataHora());
        agendamento.setStatus(StatusAgendamento.AGENDADO);
        agendamento.setConcluidoEm(null);

        return toResponse(agendamento);
    }

    @Transactional
    public AgendamentoResponse concluir(Long profissionalId, Long agendamentoId, ConclusaoRequest request) {
        Agendamento agendamento = agendamentoRepository.findByIdAndProfissionalId(agendamentoId, profissionalId)
                .orElseThrow(() -> new NotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException("Agendamentos cancelados não podem ser concluídos");
        }

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        agendamento.setObservacoesProfissional(request.observacoesProfissional());
        agendamento.setConcluidoEm(Instant.now());

        return toResponse(agendamento);
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorProfissionalNoDia(Long profissionalId, LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = inicio.plusDays(1);
        return agendamentoRepository.buscarAtivosPorProfissionalEPeriodo(profissionalId, inicio, fim).stream()
                .sorted(Comparator.comparing(Agendamento::getDataHora))
                .map(this::toResponse)
                .toList();
    }

    private void validarData(LocalDateTime dataHora, Duration duracao) {
        if (dataHora.isBefore(LocalDateTime.now())) {
            throw new BusinessException("Escolha um horário futuro para o agendamento");
        }
        LocalDateTime fim = dataHora.plus(duracao);
        LocalDateTime limite = dataHora.toLocalDate().atTime(horaFim, 0);
        if (dataHora.getHour() < horaInicio || fim.isAfter(limite)) {
            throw new BusinessException("O horário selecionado está fora do expediente disponível");
        }
    }

    private void garantirDisponibilidade(Long profissionalId, LocalDateTime inicio, Duration duracao, Long ignorarAgendamentoId) {
        LocalDate data = inicio.toLocalDate();
        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = inicioDia.plusDays(1);

        List<Agendamento> agendamentos = agendamentoRepository.buscarAtivosPorProfissionalEPeriodo(profissionalId, inicioDia, fimDia);

        LocalDateTime fim = inicio.plus(duracao);
        for (Agendamento existente : agendamentos) {
            if (ignorarAgendamentoId != null && existente.getId().equals(ignorarAgendamentoId)) {
                continue;
            }
            if (!STATUS_ATIVOS.contains(existente.getStatus())) {
                continue;
            }
            LocalDateTime existenteInicio = existente.getDataHora();
            LocalDateTime existenteFim = existenteInicio.plusMinutes(existente.getDuracaoMinutos());

            boolean conflita = inicio.isBefore(existenteFim) && fim.isAfter(existenteInicio);
            if (conflita) {
                throw new BusinessException("Já existe um agendamento neste horário. Escolha outro horário disponível.");
            }
        }
    }

    private AgendamentoResponse toResponse(Agendamento agendamento) {
        return new AgendamentoResponse(
                agendamento.getId(),
                agendamento.getDataHora(),
                agendamento.getDuracaoMinutos(),
                agendamento.getTipoServico(),
                agendamento.getStatus(),
                agendamento.getObservacoesCliente(),
                agendamento.getObservacoesProfissional(),
                agendamento.getCriadoEm(),
                agendamento.getAtualizadoEm(),
                agendamento.getConcluidoEm(),
                toPetResponse(agendamento.getAnimal()),
                toUsuarioResponse(agendamento.getCliente()),
                toUsuarioResponse(agendamento.getProfissional())
        );
    }

    private PetResponse toPetResponse(Animal animal) {
        return new PetResponse(
                animal.getId(),
                animal.getNome(),
                animal.getEspecie(),
                animal.getPorte(),
                animal.getIdade(),
                animal.getObservacoesSaude(),
                animal.getPreferencias()
        );
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getTelefone(),
                usuario.getEmail(),
                usuario.getRole().name()
        );
    }
}
