package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.PaymentRepository;
import com.jeffsilva.jkcards.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void processMercadoPagoPayment(Long mercadoPagoPaymentId) {
        com.mercadopago.resources.payment.Payment mercadoPagoPayment =
                mercadoPagoService.findPaymentById(mercadoPagoPaymentId);

        String externalReference = mercadoPagoPayment.getExternalReference();

        if (externalReference == null || externalReference.isBlank()) {
            return;
        }

        Long orderId = Long.valueOf(externalReference);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        // Recarrega o status atual e mantém o pedido bloqueado
        // até a transação terminar.
        entityManager.refresh(order, LockModeType.PESSIMISTIC_WRITE);

        Payment payment = order.getPayment();

        if (payment == null) {
            throw new ResourceNotFoundException(
                    "Payment not found for order"
            );
        }

        // O pagamento pode ter sido carregado antes do bloqueio do pedido.
        entityManager.refresh(payment);

        String mercadoPagoStatus = mercadoPagoPayment.getStatus();

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
}