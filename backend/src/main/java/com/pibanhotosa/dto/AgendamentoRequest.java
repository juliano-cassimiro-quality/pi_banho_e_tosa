package com.pibanhotosa.dto;

import com.pibanhotosa.enums.ServicoTipo;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRequest(
        @NotNull(message = "Informe o animal para o agendamento")
        Long animalId,

        @NotNull(message = "Informe o tipo de serviço desejado")
        ServicoTipo tipoServico,

        @NotNull(message = "Informe a data e hora desejada")
        @Future(message = "Agendamentos devem ser criados para datas futuras")
        LocalDateTime dataHora,

        String observacoesCliente
) {
}
