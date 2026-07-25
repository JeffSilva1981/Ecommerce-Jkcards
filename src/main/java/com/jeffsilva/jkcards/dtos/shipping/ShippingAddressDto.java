package com.jeffsilva.jkcards.dtos.shipping;

import com.jeffsilva.jkcards.entities.ShippingAddress;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ShippingAddressDto {

    @NotBlank(message = "The recipient name is required.")
    @Size(
            min = 3,
            max = 100,
            message = "The recipient name must be between 3 and 100 characters."
    )
    private String recipientName;

    @NotBlank(message = "The recipient phone is required.")
    @Pattern(
            regexp = "^[0-9()+\\-\\s]{10,20}$",
            message = "Enter a valid phone number."
    )
    private String recipientPhone;

    @NotBlank(message = "The postal code is required.")
    @Pattern(
            regexp = "^\\d{5}-?\\d{3}$",
            message = "Enter a valid postal code."
    )
    private String postalCode;

    @NotBlank(message = "The street is required.")
    @Size(
            min = 3,
            max = 150,
            message = "The street must be between 3 and 150 characters."
    )
    private String street;

    @NotBlank(message = "The address number is required.")
    @Size(
            max = 20,
            message = "The address number must have at most 20 characters."
    )
    private String number;

    @Size(
            max = 100,
            message = "The complement must have at most 100 characters."
    )
    private String complement;

    @NotBlank(message = "The neighborhood is required.")
    @Size(
            min = 2,
            max = 100,
            message = "The neighborhood must be between 2 and 100 characters."
    )
    private String neighborhood;

    @NotBlank(message = "The city is required.")
    @Size(
            min = 2,
            max = 100,
            message = "The city must be between 2 and 100 characters."
    )
    private String city;

    @NotBlank(message = "The state is required.")
    @Pattern(
            regexp = "^[A-Za-z]{2}$",
            message = "Enter the state abbreviation using 2 letters."
    )
    private String state;

    public ShippingAddressDto() {
    }

    public ShippingAddressDto(ShippingAddress entity) {
        recipientName = entity.getRecipientName();
        recipientPhone = entity.getRecipientPhone();
        postalCode = entity.getPostalCode();
        street = entity.getStreet();
        number = entity.getNumber();
        complement = entity.getComplement();
        neighborhood = entity.getNeighborhood();
        city = entity.getCity();
        state = entity.getState();
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getComplement() {
        return complement;
    }

    public void setComplement(String complement) {
        this.complement = complement;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}