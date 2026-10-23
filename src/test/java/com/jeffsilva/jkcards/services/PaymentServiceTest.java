package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.PaymentRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    private static final Long ORDER_ID = 42L;
    private static final Long MERCADO_PAGO_PAYMENT_ID = 123L;

    // ID fictício, usado somente para simular a conta nos testes.
    private static final Long TEST_COLLECTOR_ID = 987654321L;

    @Mock
    private EntityManager entityManager;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private MercadoPagoService mercadoPagoService;

    @Mock
    private com.mercadopago.resources.payment.Payment mercadoPagoPayment;

    @InjectMocks
    private PaymentService paymentService;

    private Order order;
    private Payment payment;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(
                paymentService,
                "expectedCollectorId",
                TEST_COLLECTOR_ID.toString()
        );

        order = new Order();
        order.setId(ORDER_ID);
        order.setStatus(OrderStatus.WAITING_PAYMENT);
        order.setDeliveryMethod(DeliveryMethod.SHIPPING);

        payment = new Payment();
        order.setPayment(payment);

        when(orderRepository.findById(ORDER_ID))
                .thenReturn(Optional.of(order));

        when(mercadoPagoService.findPaymentById(MERCADO_PAGO_PAYMENT_ID))
                .thenReturn(mercadoPagoPayment);

        when(mercadoPagoPayment.getCollectorId())
                .thenReturn(TEST_COLLECTOR_ID);
        ReflectionTestUtils.setField(paymentService, "expectedLiveMode", true);
        when(mercadoPagoPayment.isLiveMode())
                .thenReturn(true);
        when(mercadoPagoPayment.getExternalReference())
                .thenReturn(ORDER_ID.toString());
    }

    @Test
    void marcaPedidoPagoQuandoValorFreteEMoedaConferem() {
        addOrderItem(10.00, 2);
        order.setShippingPrice(5.00);

        configurePayment("approved", "25.00");
        when(mercadoPagoPayment.getCurrencyId()).thenReturn("BRL");

        paymentService.processMercadoPagoPayment(MERCADO_PAGO_PAYMENT_ID);

        assertEquals(OrderStatus.PAID, order.getStatus());
        assertEquals("approved", payment.getPaymentStatus());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    @Test
    void rejeitaPagamentoAprovadoComValorDiferente() {
        addOrderItem(10.00, 2);
        order.setShippingPrice(5.00);

        configurePayment("approved", "24.99");

        assertThrows(
                IllegalStateException.class,
                () -> paymentService.processMercadoPagoPayment(
                        MERCADO_PAGO_PAYMENT_ID
                )
        );

        assertEquals(OrderStatus.WAITING_PAYMENT, order.getStatus());
        verifyNoInteractions(paymentRepository);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void rejeitaPagamentoAprovadoComMoedaDiferente() {
        addOrderItem(10.00, 2);
        order.setShippingPrice(5.00);

        configurePayment("approved", "25.00");
        when(mercadoPagoPayment.getCurrencyId()).thenReturn("USD");

        assertThrows(
                IllegalStateException.class,
                () -> paymentService.processMercadoPagoPayment(
                        MERCADO_PAGO_PAYMENT_ID
                )
        );

        assertEquals(OrderStatus.WAITING_PAYMENT, order.getStatus());
        verifyNoInteractions(paymentRepository);
        verify(orderRepository, never()).save(any(Order.class));
    }

    private void addOrderItem(double unitPrice, int quantity) {
        OrderItem item = mock(OrderItem.class);
        when(item.getPrice()).thenReturn(unitPrice);
        when(item.getQuantity()).thenReturn(quantity);
        order.getItems().add(item);
    }

    private void configurePayment(String status, String amount) {
        when(mercadoPagoPayment.getStatus()).thenReturn(status);
        when(mercadoPagoPayment.getTransactionAmount())
                .thenReturn(new BigDecimal(amount));
    }
}