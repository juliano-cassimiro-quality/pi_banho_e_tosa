package com.pibanhotosa.dto;

public record PetResponse(
        Long id,
        String nome,
        String especie,
        String porte,
        Integer idade,
        String observacoesSaude,
        String preferencias
) {
}
