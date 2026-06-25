package com.jeffsilva.jkcards.entities;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "tb_payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private Instant moment;

    private String mercadoPagoPreferenceId;

    @Column(columnDefinition = "TEXT")
    private String checkoutUrl;

    private String paymentStatus;

    @OneToOne
    @MapsId
    private Order order;

    public Payment() {

    }

    public Payment(Long id, Instant moment, String mercadoPagoPreferenceId, String checkoutUrl, String paymentStatus, Order order) {
        this.id = id;
        this.moment = moment;
        this.mercadoPagoPreferenceId = mercadoPagoPreferenceId;
        this.checkoutUrl = checkoutUrl;
        this.paymentStatus = paymentStatus;
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getMoment() {
        return moment;
    }

    public void setMoment(Instant moment) {
        this.moment = moment;
    }

    public String getMercadoPagoPreferenceId() {
        return mercadoPagoPreferenceId;
    }

    public void setMercadoPagoPreferenceId(String mercadoPagoPreferenceId) {
        this.mercadoPagoPreferenceId = mercadoPagoPreferenceId;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
