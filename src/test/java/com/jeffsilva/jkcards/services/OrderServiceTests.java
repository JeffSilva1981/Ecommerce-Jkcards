package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.OrderCreateDto;
import com.jeffsilva.jkcards.dtos.OrderCreateItemDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingAddressDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteRequestDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingSelectionDto;
import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.Payment;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderItemRepository;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.services.exceptions.DataBaseException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@ExtendWith(SpringExtension.class)
public class OrderServiceTests {

    @InjectMocks
    private OrderService service;

    @Mock
    private OrderRepository repository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private UserService userService;

    @Mock
    private AuthService authService;

    @Mock
    private MercadoPagoService mercadoPagoService;

    @Mock
    private ShippingService shippingService;

    private Product product;
    private User user;
    private OrderCreateDto orderCreateDto;
    private ShippingQuoteDto shippingQuote;

    @BeforeEach
    void setUp() {
        product = new Product(
                1L,
                "Booster Pokémon",
                "Produto de teste",
                50.0,
                "https://example.com/product.jpg",
                10,
                0.2,
                15.0,
                5.0,
                20.0
        );

        user = new User(
                1L,
                "Cliente Teste",
                "cliente@jkcards.com",
                "15999999999",
                LocalDate.of(1995, 1, 1),
                "password"
        );

        ShippingAddressDto address = new ShippingAddressDto();
        address.setRecipientName("Cliente Teste");
        address.setRecipientPhone("15999999999");
        address.setPostalCode("18000-000");
        address.setStreet("Rua de Teste");
        address.setNumber("75");
        address.setComplement("Casa");
        address.setNeighborhood("Centro");
        address.setCity("Sorocaba");
        address.setState("SP");

        orderCreateDto = new OrderCreateDto(
                List.of(
                        new OrderCreateItemDto(1L, 1),
                        new OrderCreateItemDto(1L, 2)
                ),
                address,
                new ShippingSelectionDto(
                        DeliveryMethod.SHIPPING,
                        2L
                )
        );

        shippingQuote = new ShippingQuoteDto(
                2L,
                "PAC",
                "Correios",
                null,
                BigDecimal.valueOf(20.0),
                5
        );
    }

    @Test
    public void insertShouldCreateOrderWithShippingWhenValidData() {
        mockAuthenticatedUserAndProduct();
        mockRepositorySave();
        mockPaymentPreference();

        Mockito.when(
                shippingService.validateSelectedQuote(
                        Mockito.any(
                                ShippingQuoteRequestDto.class
                        ),
                        Mockito.eq(2L)
                )
        ).thenReturn(shippingQuote);

        var result = service.insert(orderCreateDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1L, result.getId());
        Assertions.assertEquals(
                OrderStatus.WAITING_PAYMENT,
                result.getStatus()
        );

        Assertions.assertEquals(
                1,
                result.getItems().size()
        );

        Assertions.assertEquals(
                3,
                result.getItems().get(0).getQuantity()
        );

        Assertions.assertEquals(
                7,
                product.getStockQuantity()
        );

        Assertions.assertNotNull(
                result.getShipping()
        );

        Assertions.assertEquals(
                DeliveryMethod.SHIPPING,
                result.getShipping().getMethod()
        );

        Assertions.assertEquals(
                2L,
                result.getShipping().getServiceId()
        );

        Assertions.assertEquals(
                "PAC",
                result.getShipping().getServiceName()
        );

        Assertions.assertEquals(
                "Correios",
                result.getShipping().getCarrier()
        );

        Assertions.assertEquals(
                20.0,
                result.getShipping().getPrice()
        );

        Assertions.assertNotNull(
                result.getShippingAddress()
        );

        Assertions.assertEquals(
                "18000000",
                result.getShippingAddress().getPostalCode()
        );

        Assertions.assertEquals(
                "Sorocaba",
                result.getShippingAddress().getCity()
        );

        Assertions.assertEquals(
                "SP",
                result.getShippingAddress().getState()
        );

        Assertions.assertNotNull(
                result.getPayment()
        );

        Assertions.assertEquals(
                "https://mercadopago.com/checkout",
                result.getPayment().getCheckoutUrl()
        );

        Assertions.assertEquals(
                150.0,
                result.getProductsTotal()
        );

        Assertions.assertEquals(
                170.0,
                result.getTotal()
        );

        ArgumentCaptor<ShippingQuoteRequestDto> quoteCaptor =
                ArgumentCaptor.forClass(
                        ShippingQuoteRequestDto.class
                );

        Mockito.verify(
                shippingService
        ).validateSelectedQuote(
                quoteCaptor.capture(),
                Mockito.eq(2L)
        );

        ShippingQuoteRequestDto quoteRequest =
                quoteCaptor.getValue();

        Assertions.assertEquals(
                "18000-000",
                quoteRequest.getDestinationPostalCode()
        );

        Assertions.assertEquals(
                1,
                quoteRequest.getItems().size()
        );

        Assertions.assertEquals(
                1L,
                quoteRequest.getItems().get(0).getProductId()
        );

        Assertions.assertEquals(
                3,
                quoteRequest.getItems().get(0).getQuantity()
        );

        Mockito.verify(
                productRepository,
                Mockito.times(1)
        ).findById(1L);

        Mockito.verify(
                repository,
                Mockito.times(2)
        ).save(Mockito.any(Order.class));

        Mockito.verify(
                orderItemRepository
        ).saveAll(Mockito.anyCollection());

        Mockito.verify(
                mercadoPagoService
        ).createPaymentPreference(
                Mockito.any(Order.class)
        );
    }

    @Test
    public void insertShouldCreateOrderWithPickupWithoutCallingShippingService() {
        OrderCreateDto pickupOrder = new OrderCreateDto(
                List.of(
                        new OrderCreateItemDto(1L, 3)
                ),
                null,
                new ShippingSelectionDto(
                        DeliveryMethod.PICKUP,
                        null
                )
        );

        mockAuthenticatedUserAndProduct();
        mockRepositorySave();
        mockPaymentPreference();

        var result = service.insert(pickupOrder);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1L, result.getId());

        Assertions.assertNotNull(
                result.getShipping()
        );

        Assertions.assertEquals(
                DeliveryMethod.PICKUP,
                result.getShipping().getMethod()
        );

        Assertions.assertNull(
                result.getShipping().getServiceId()
        );

        Assertions.assertEquals(
                "Retirada na loja",
                result.getShipping().getServiceName()
        );

        Assertions.assertEquals(
                "JKCards",
                result.getShipping().getCarrier()
        );

        Assertions.assertEquals(
                0.0,
                result.getShipping().getPrice()
        );

        Assertions.assertNull(
                result.getShipping().getDeliveryDays()
        );

        Assertions.assertNull(
                result.getShippingAddress()
        );

        Assertions.assertEquals(
                7,
                product.getStockQuantity()
        );

        Assertions.assertEquals(
                150.0,
                result.getProductsTotal()
        );

        Assertions.assertEquals(
                150.0,
                result.getTotal()
        );

        Mockito.verifyNoInteractions(
                shippingService
        );

        ArgumentCaptor<Order> orderCaptor =
                ArgumentCaptor.forClass(Order.class);

        Mockito.verify(
                mercadoPagoService
        ).createPaymentPreference(
                orderCaptor.capture()
        );

        Order savedOrder = orderCaptor.getValue();

        Assertions.assertEquals(
                DeliveryMethod.PICKUP,
                savedOrder.getDeliveryMethod()
        );

        Assertions.assertEquals(
                0.0,
                savedOrder.getShippingPrice()
        );

        Assertions.assertNull(
                savedOrder.getShippingAddress()
        );
    }

    @Test
    public void insertShouldThrowDataBaseExceptionWhenStockIsInsufficient() {
        product.setStockQuantity(2);

        mockAuthenticatedUserAndProduct();

        Mockito.when(
                shippingService.validateSelectedQuote(
                        Mockito.any(
                                ShippingQuoteRequestDto.class
                        ),
                        Mockito.eq(2L)
                )
        ).thenReturn(shippingQuote);

        Assertions.assertThrows(
                DataBaseException.class,
                () -> service.insert(orderCreateDto)
        );

        Assertions.assertEquals(
                2,
                product.getStockQuantity()
        );

        Mockito.verify(
                repository,
                Mockito.never()
        ).save(Mockito.any(Order.class));

        Mockito.verify(
                orderItemRepository,
                Mockito.never()
        ).saveAll(Mockito.anyCollection());

        Mockito.verify(
                mercadoPagoService,
                Mockito.never()
        ).createPaymentPreference(
                Mockito.any(Order.class)
        );
    }

    private void mockAuthenticatedUserAndProduct() {
        Mockito.when(
                userService.authenticated()
        ).thenReturn(user);

        Mockito.when(
                productRepository.findById(1L)
        ).thenReturn(Optional.of(product));
    }

    private void mockRepositorySave() {
        Mockito.when(
                repository.save(Mockito.any(Order.class))
        ).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);

            if (order.getId() == null) {
                order.setId(1L);
            }

            return order;
        });
    }

    private void mockPaymentPreference() {
        Mockito.when(
                mercadoPagoService.createPaymentPreference(
                        Mockito.any(Order.class)
                )
        ).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);

            return new Payment(
                    1L,
                    null,
                    "preference-id",
                    "https://mercadopago.com/checkout",
                    "PENDING",
                    order
            );
        });
    }
}