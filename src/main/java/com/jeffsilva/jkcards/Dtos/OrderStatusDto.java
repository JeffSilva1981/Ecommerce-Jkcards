package com.jeffsilva.jkcards.Dtos;

import com.jeffsilva.jkcards.entities.enums.OrderStatus;

public record OrderStatusDto(
        OrderStatus status
) {
}
