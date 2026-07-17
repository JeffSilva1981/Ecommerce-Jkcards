package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.enums.OrderStatus;

public record OrderStatusDto(
        OrderStatus status
) {
}
