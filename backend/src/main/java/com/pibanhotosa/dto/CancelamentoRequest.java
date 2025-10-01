package com.pibanhotosa.dto;

import jakarta.validation.constraints.NotBlank;

public record CancelamentoRequest(
        @NotBlank(message = "Informe o motivo do cancelamento")
        String motivo
) {
}
