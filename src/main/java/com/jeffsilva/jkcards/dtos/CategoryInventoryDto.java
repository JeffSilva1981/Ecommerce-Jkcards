package com.jeffsilva.jkcards.dtos;

public record CategoryInventoryDto(
        Long categoryId,
        String categoryName,
        Double inventoryValue,
        Long stockUnits
) {
}