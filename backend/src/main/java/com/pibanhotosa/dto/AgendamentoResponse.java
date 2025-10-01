package com.pibanhotosa.dto;

import com.pibanhotosa.enums.ServicoTipo;
import com.pibanhotosa.enums.StatusAgendamento;

import java.time.Instant;
import java.time.LocalDateTime;

public record AgendamentoResponse(
        Long id,
        LocalDateTime dataHora,
        int duracaoMinutos,
        ServicoTipo tipoServico,
        StatusAgendamento status,
        String observacoesCliente,
        String observacoesProfissional,
        Instant criadoEm,
        Instant atualizadoEm,
        Instant concluidoEm,
        PetResponse animal,
        UsuarioResponse cliente,
        UsuarioResponse profissional
) {
}
