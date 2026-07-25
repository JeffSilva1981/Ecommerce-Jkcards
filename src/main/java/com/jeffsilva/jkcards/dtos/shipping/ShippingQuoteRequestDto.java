package com.jeffsilva.jkcards.dtos.shipping;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
import java.util.List;

public class ShippingQuoteRequestDto {

    @NotBlank(message = "The destination postal code must not be empty.")
    @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "The destination postal code must contain 8 digits.")
    private String destinationPostalCode;

    @Valid
    @NotEmpty(message = "At least one item is required to calculate shipping.")
    private List<ShippingQuoteItemDto> items = new ArrayList<>();

    public ShippingQuoteRequestDto() {
    }

    public ShippingQuoteRequestDto(String destinationPostalCode, List<ShippingQuoteItemDto> items) {
        this.destinationPostalCode = destinationPostalCode;
        this.items = items;
    }

    public String getDestinationPostalCode() {
        return destinationPostalCode;
    }

    public List<ShippingQuoteItemDto> getItems() {
        return items;
    }
}