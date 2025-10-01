package com.pibanhotosa.dto;

import java.time.LocalDateTime;

public record SlotDisponivelResponse(
        LocalDateTime inicio,
        LocalDateTime fim
) {
}
