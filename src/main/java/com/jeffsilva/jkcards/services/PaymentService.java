package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.PaymentRepository;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class PaymentService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    @Value("${mercadopago.collector-id:}")
    private String expectedCollectorId;

    @Value("${mercadopago.live-mode:true}")
    private boolean expectedLiveMode;

    @Transactional
    public void processMercadoPagoPayment(Long mercadoPagoPaymentId) {
        if (mercadoPagoPaymentId == null || mercadoPagoPaymentId <= 0) {
            throw new IllegalArgumentException(
                    "Invalid Mercado Pago payment ID"
            );
        }

        com.mercadopago.resources.payment.Payment mercadoPagoPayment =
                mercadoPagoService.findPaymentById(mercadoPagoPaymentId);

        validateCollectorAndMode(mercadoPagoPayment);

        String externalReference = mercadoPagoPayment.getExternalReference();

        if (externalReference == null || externalReference.isBlank()) {
            throw new IllegalStateException(
                    "Mercado Pago payment has no external reference"
            );
        }

        Long orderId;

        try {
            orderId = Long.valueOf(externalReference);
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                    "Mercado Pago payment has an invalid external reference",
                    e
            );
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        entityManager.refresh(order, LockModeType.PESSIMISTIC_WRITE);

        Payment payment = order.getPayment();

        if (payment == null) {
            throw new ResourceNotFoundException(
                    "Payment not found for order"
            );
        }

        entityManager.refresh(payment);

        String mercadoPagoStatus = mercadoPagoPayment.getStatus();

        if (mercadoPagoStatus == null || mercadoPagoStatus.isBlank()) {
            throw new IllegalStateException(
                    "Mercado Pago payment has no status"
            );
        }

        if ("approved".equalsIgnoreCase(mercadoPagoStatus)) {
            validateApprovedPaymentAmount(mercadoPagoPayment, order);
        }

        payment.setPaymentStatus(mercadoPagoStatus);

        if ("approved".equalsIgnoreCase(mercadoPagoStatus)
                && order.getStatus() == OrderStatus.WAITING_PAYMENT) {

            if (payment.getMoment() == null) {
                payment.setMoment(Instant.now());
            }

            order.setStatus(OrderStatus.PAID);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
    }

    private void validateCollectorAndMode(
            com.mercadopago.resources.payment.Payment mercadoPagoPayment) {

        if (expectedCollectorId == null || expectedCollectorId.isBlank()) {
            throw new IllegalStateException(
                    "Mercado Pago collector ID is not configured"
            );
        }

        Long configuredCollectorId;

        try {
            configuredCollectorId = Long.valueOf(expectedCollectorId.trim());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                    "Mercado Pago collector ID configuration is invalid",
                    e
            );
        }

        Long actualCollectorId = mercadoPagoPayment.getCollectorId();

        if (!configuredCollectorId.equals(actualCollectorId)) {
            throw new IllegalStateException(
                    "Mercado Pago payment belongs to a different collector"
            );
        }

        if (mercadoPagoPayment.isLiveMode() != expectedLiveMode) {
            throw new IllegalStateException(
                    "Mercado Pago payment mode does not match this environment"
            );
        }
    }

    private void validateApprovedPaymentAmount(
            com.mercadopago.resources.payment.Payment mercadoPagoPayment,
            Order order) {

        BigDecimal expectedAmount = order.getItems().stream()
                .map(this::calculateItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (order.getDeliveryMethod() != DeliveryMethod.PICKUP) {
            if (order.getShippingPrice() == null) {
                throw new IllegalStateException(
                        "Order with delivery has no shipping price"
                );
            }

            expectedAmount = expectedAmount.add(
                    BigDecimal.valueOf(order.getShippingPrice())
            );
        }

        BigDecimal receivedAmount =
                mercadoPagoPayment.getTransactionAmount();

        if (receivedAmount == null
                || expectedAmount.compareTo(receivedAmount) != 0
                || !"BRL".equals(mercadoPagoPayment.getCurrencyId())) {
            throw new IllegalStateException(
                    "Payment amount or currency does not match the order"
            );
        }
    }

    private BigDecimal calculateItemTotal(OrderItem item) {
        if (item.getPrice() == null || item.getQuantity() == null) {
            throw new IllegalStateException(
                    "Order item has no price or quantity"
            );
        }

        return BigDecimal.valueOf(item.getPrice())
                .multiply(BigDecimal.valueOf(item.getQuantity()));
    }
}