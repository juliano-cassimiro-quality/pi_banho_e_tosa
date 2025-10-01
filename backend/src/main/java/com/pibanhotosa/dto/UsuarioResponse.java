package com.pibanhotosa.dto;

public record UsuarioResponse(
        Long id,
        String nome,
        String telefone,
        String email,
        String role
) {
}
