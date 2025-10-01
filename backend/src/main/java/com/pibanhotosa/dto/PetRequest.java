package com.pibanhotosa.dto;

import jakarta.validation.constraints.NotBlank;

public record PetRequest(
        @NotBlank(message = "O nome do animal é obrigatório")
        String nome,
        @NotBlank(message = "Informe a espécie do animal")
        String especie,
        String porte,
        Integer idade,
        String observacoesSaude,
        String preferencias
) {
}
