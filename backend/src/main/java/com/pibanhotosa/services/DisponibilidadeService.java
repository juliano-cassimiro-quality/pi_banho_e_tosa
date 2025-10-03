package com.pibanhotosa.services;

import com.pibanhotosa.dto.SlotDisponivelResponse;
import com.pibanhotosa.entities.Agendamento;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.ServicoTipo;
import com.pibanhotosa.enums.StatusAgendamento;
import com.pibanhotosa.repositories.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class DisponibilidadeService {

    private static final Set<StatusAgendamento> STATUS_CONSIDERADOS = Set.of(
            StatusAgendamento.AGENDADO,
            StatusAgendamento.CONFIRMADO,
            StatusAgendamento.CONCLUIDO
    );

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioService usuarioService;
    private final int horaInicio;
    private final int horaFim;
    private final int intervaloMinutos;

    public DisponibilidadeService(AgendamentoRepository agendamentoRepository,
                                  UsuarioService usuarioService,
                                  @Value("${app.schedule.start-hour}") int horaInicio,
                                  @Value("${app.schedule.end-hour}") int horaFim,
                                  @Value("${app.schedule.slot-minutes}") int intervaloMinutos) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioService = usuarioService;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.intervaloMinutos = intervaloMinutos;
    }

    @Transactional(readOnly = true)
    public List<SlotDisponivelResponse> listarDisponibilidade(LocalDate data, ServicoTipo tipoServico) {
        Usuario profissional = usuarioService.buscarProfissionalPadrao();

        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = inicioDia.plusDays(1);

        List<Agendamento> agendamentos = agendamentoRepository
                .buscarAtivosPorProfissionalEPeriodo(profissional.getId(), inicioDia, fimDia).stream()
                .filter(agendamento -> STATUS_CONSIDERADOS.contains(agendamento.getStatus()))
                .sorted(Comparator.comparing(Agendamento::getDataHora))
                .toList();

        List<SlotDisponivelResponse> slots = new ArrayList<>();
        LocalTime inicioExpediente = LocalTime.of(horaInicio, 0);
        LocalTime fimExpediente = LocalTime.of(horaFim, 0);

        LocalDateTime cursor = LocalDateTime.of(data, inicioExpediente);
        LocalDateTime limite = LocalDateTime.of(data, fimExpediente);

        while (!cursor.plus(tipoServico.getDuracao()).isAfter(limite)) {
            LocalDateTime potencialFim = cursor.plus(tipoServico.getDuracao());
            if (cursor.isAfter(LocalDateTime.now()) || cursor.isEqual(LocalDateTime.now())) {
                boolean livre = agendamentos.stream().noneMatch(agendamento -> {
                    LocalDateTime inicioAgendamento = agendamento.getDataHora();
                    LocalDateTime fimAgendamento = inicioAgendamento.plusMinutes(agendamento.getDuracaoMinutos());
                    return cursor.isBefore(fimAgendamento) && potencialFim.isAfter(inicioAgendamento);
                });
                if (livre) {
                    slots.add(new SlotDisponivelResponse(cursor, potencialFim));
                }
            }
            cursor.plusMinutes(intervaloMinutos);
        }

        return slots;
    }
}
