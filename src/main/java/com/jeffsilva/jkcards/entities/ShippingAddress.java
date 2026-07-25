package com.jeffsilva.jkcards.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ShippingAddress {

    @Column(name = "shipping_recipient_name")
    private String recipientName;

    @Column(name = "shipping_recipient_phone")
    private String recipientPhone;

    @Column(name = "shipping_postal_code")
    private String postalCode;

    @Column(name = "shipping_street")
    private String street;

    @Column(name = "shipping_number")
    private String number;

    @Column(name = "shipping_complement")
    private String complement;

    @Column(name = "shipping_neighborhood")
    private String neighborhood;

    @Column(name = "shipping_city")
    private String city;

    @Column(name = "shipping_state")
    private String state;

    public ShippingAddress() {
    }

    public ShippingAddress(
            String recipientName,
            String recipientPhone,
            String postalCode,
            String street,
            String number,
            String complement,
            String neighborhood,
            String city,
            String state
    ) {
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.postalCode = postalCode;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
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