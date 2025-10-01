package com.pibanhotosa.controllers;

import com.pibanhotosa.dto.AgendamentoRequest;
import com.pibanhotosa.dto.AgendamentoResponse;
import com.pibanhotosa.dto.CancelamentoRequest;
import com.pibanhotosa.dto.ConclusaoRequest;
import com.pibanhotosa.dto.ReagendamentoRequest;
import com.pibanhotosa.dto.SlotDisponivelResponse;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.Role;
import com.pibanhotosa.enums.ServicoTipo;
import com.pibanhotosa.services.AgendamentoService;
import com.pibanhotosa.services.DisponibilidadeService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final DisponibilidadeService disponibilidadeService;

    public AgendamentoController(AgendamentoService agendamentoService,
                                 DisponibilidadeService disponibilidadeService) {
        this.agendamentoService = agendamentoService;
        this.disponibilidadeService = disponibilidadeService;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        if (usuario.getRole() == Role.PROFISSIONAL) {
            return ResponseEntity.ok(agendamentoService.listarPorProfissional(usuario.getId()));
        }
        return ResponseEntity.ok(agendamentoService.listarPorCliente(usuario.getId()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<AgendamentoResponse>> listarHoje(@AuthenticationPrincipal Usuario usuario,
                                                                @RequestParam(name = "date", required = false)
                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        if (usuario.getRole() != Role.PROFISSIONAL) {
            return ResponseEntity.status(403).build();
        }
        LocalDate dia = data != null ? data : LocalDate.now();
        return ResponseEntity.ok(agendamentoService.listarPorProfissionalNoDia(usuario.getId(), dia));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@AuthenticationPrincipal Usuario usuario,
                                                     @Valid @RequestBody AgendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.criar(usuario.getId(), request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<AgendamentoResponse> cancelar(@AuthenticationPrincipal Usuario usuario,
                                                        @PathVariable Long id,
                                                        @Valid @RequestBody CancelamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.cancelar(usuario.getId(), id, request));
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<AgendamentoResponse> reagendar(@AuthenticationPrincipal Usuario usuario,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody ReagendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.reagendar(usuario.getId(), id, request));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<AgendamentoResponse> concluir(@AuthenticationPrincipal Usuario usuario,
                                                        @PathVariable Long id,
                                                        @RequestBody ConclusaoRequest request) {
        return ResponseEntity.ok(agendamentoService.concluir(usuario.getId(), id, request));
    }

    @GetMapping("/availability")
    public ResponseEntity<List<SlotDisponivelResponse>> disponibilidade(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam("serviceType") ServicoTipo tipo) {
        return ResponseEntity.ok(disponibilidadeService.listarDisponibilidade(data, tipo));
    }
}
