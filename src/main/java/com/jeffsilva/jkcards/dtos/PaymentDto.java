package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.Payment;

import java.time.Instant;

public class PaymentDto {

    private Long id;
    private Instant moment;
    private String checkoutUrl;
    private String paymentStatus;

    public PaymentDto(Long id, Instant moment, String checkoutUrl, String paymentStatus) {
        this.id = id;
        this.moment = moment;
        this.checkoutUrl = checkoutUrl;
        this.paymentStatus = paymentStatus;
    }

    public PaymentDto(Payment entity) {
        id = entity.getId();
        moment = entity.getMoment();
        checkoutUrl = entity.getCheckoutUrl();
        paymentStatus = entity.getPaymentStatus();
    }

    public Long getId() {
        return id;
    }

    public Instant getMoment() {
        return moment;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
}
