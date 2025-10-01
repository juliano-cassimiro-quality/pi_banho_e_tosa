package com.pibanhotosa.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReagendamentoRequest(
        @NotNull(message = "Informe a nova data e horário")
        @Future(message = "O novo horário deve ser no futuro")
        LocalDateTime novaDataHora
) {
}
