package com.pibanhotosa.enums;

import java.time.Duration;

public enum ServicoTipo {
    BANHO(Duration.ofMinutes(60)),
    TOSA(Duration.ofMinutes(75)),
    BANHO_E_TOSA(Duration.ofMinutes(105));

    private final Duration duracao;

    ServicoTipo(Duration duracao) {
        this.duracao = duracao;
    }

    public Duration getDuracao() {
        return duracao;
    }
}
