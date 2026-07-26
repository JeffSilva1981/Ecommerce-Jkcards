package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.config.MelhorEnvioProperties;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteItemDto;
import com.jeffsilva.jkcards.dtos.shipping.ShippingQuoteRequestDto;
import com.jeffsilva.jkcards.entities.Category;
import com.jeffsilva.jkcards.entities.Product;
import com.jeffsilva.jkcards.integrations.melhorenvio.MelhorEnvioClient;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioProductRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteRequest;
import com.jeffsilva.jkcards.integrations.melhorenvio.dtos.MelhorEnvioQuoteResponse;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShippingServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MelhorEnvioClient melhorEnvioClient;

    @Mock
    private MelhorEnvioProperties properties;

    @InjectMocks
    private ShippingService service;

    @BeforeEach
    void setUp() {
        MelhorEnvioQuoteResponse response = mock(MelhorEnvioQuoteResponse.class);

        when(properties.getOriginPostalCode()).thenReturn("18076580");
        when(response.getId()).thenReturn(2L);
        when(response.getName()).thenReturn("SEDEX");
        when(response.getCustomPrice()).thenReturn(BigDecimal.TEN);
        when(response.getCustomDeliveryTime()).thenReturn(2);
        when(melhorEnvioClient.calculate(any())).thenReturn(List.of(response));
    }

    @ParameterizedTest
    @CsvSource({
            "1,11,2,16,0.1",
            "10,11,2,16,0.1",
            "30,15,5,20,0.19",
            "50,16,8,22,0.3"
    })
    void shouldGroupCardsInOnePackage(
            int quantity,
            double width,
            double height,
            double length,
            double weight
    ) {
        Product card = card(1L, 100);
        when(productRepository.findById(1L)).thenReturn(Optional.of(card));

        service.calculateQuotes(request(new ShippingQuoteItemDto(1L, quantity)));

        List<MelhorEnvioProductRequest> products = capturedRequest().getProducts();
        MelhorEnvioProductRequest product = products.get(0);

        assertAll(
                () -> assertEquals(1, products.size()),
                () -> assertEquals("cards-1", product.getId()),
                () -> assertEquals(width, product.getWidth()),
                () -> assertEquals(height, product.getHeight()),
                () -> assertEquals(length, product.getLength()),
                () -> assertEquals(weight, product.getWeight()),
                () -> assertEquals(1, product.getQuantity())
        );
    }

    @Test
    void shouldCreateTwoPackagesForFiftyOneCards() {
        Product card = card(1L, 100);
        when(productRepository.findById(1L)).thenReturn(Optional.of(card));

        service.calculateQuotes(request(new ShippingQuoteItemDto(1L, 51)));

        List<MelhorEnvioProductRequest> products = capturedRequest().getProducts();

        assertAll(
                () -> assertEquals(2, products.size()),
                () -> assertEquals("cards-1", products.get(0).getId()),
                () -> assertEquals(16.0, products.get(0).getWidth()),
                () -> assertEquals(8.0, products.get(0).getHeight()),
                () -> assertEquals(22.0, products.get(0).getLength()),
                () -> assertEquals(0.3, products.get(0).getWeight()),
                () -> assertEquals(new BigDecimal("500.00"), products.get(0).getInsuranceValue()),
                () -> assertEquals(1, products.get(0).getQuantity()),
                () -> assertEquals("cards-2", products.get(1).getId()),
                () -> assertEquals(11.0, products.get(1).getWidth()),
                () -> assertEquals(2.0, products.get(1).getHeight()),
                () -> assertEquals(16.0, products.get(1).getLength()),
                () -> assertEquals(0.1, products.get(1).getWeight()),
                () -> assertEquals(new BigDecimal("10.00"), products.get(1).getInsuranceValue()),
                () -> assertEquals(1, products.get(1).getQuantity())
        );
    }

    @Test
    void shouldKeepCardsAndRegularProductsSeparated() {
        Product card = card(1L, 100);
        Product regular = product(2L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(card));
        when(productRepository.findById(2L)).thenReturn(Optional.of(regular));

        service.calculateQuotes(request(
                new ShippingQuoteItemDto(1L, 10),
                new ShippingQuoteItemDto(2L, 1)
        ));

        List<MelhorEnvioProductRequest> products = capturedRequest().getProducts();

        MelhorEnvioProductRequest cardPackage = products.stream()
                .filter(product -> product.getId().equals("cards-1"))
                .findFirst()
                .orElseThrow();

        MelhorEnvioProductRequest regularProduct = products.stream()
                .filter(product -> product.getId().equals("2"))
                .findFirst()
                .orElseThrow();

        assertAll(
                () -> assertEquals(2, products.size()),
                () -> assertEquals(11.0, cardPackage.getWidth()),
                () -> assertEquals(2.0, cardPackage.getHeight()),
                () -> assertEquals(16.0, cardPackage.getLength()),
                () -> assertEquals(0.1, cardPackage.getWeight()),
                () -> assertEquals(20.0, regularProduct.getWidth()),
                () -> assertEquals(15.0, regularProduct.getHeight()),
                () -> assertEquals(25.0, regularProduct.getLength()),
                () -> assertEquals(1.0, regularProduct.getWeight()),
                () -> assertEquals(1, regularProduct.getQuantity())
        );
    }

    private ShippingQuoteRequestDto request(ShippingQuoteItemDto... items) {
        return new ShippingQuoteRequestDto("01140151", List.of(items));
    }

    private Product card(Long id, int stock) {
        Product product = new Product(
                id,
                "Carta",
                "",
                10.0,
                "",
                stock,
                null,
                null,
                null,
                null
        );

        Category category = new Category();
        category.setId(6L);
        category.setName("Cartas");
        product.getCategories().add(category);

        return product;
    }

    private Product product(Long id) {
        return new Product(
                id,
                "Produto",
                "",
                100.0,
                "",
                10,
                1.0,
                20.0,
                15.0,
                25.0
        );
    }

    private MelhorEnvioQuoteRequest capturedRequest() {
        ArgumentCaptor<MelhorEnvioQuoteRequest> captor =
                ArgumentCaptor.forClass(MelhorEnvioQuoteRequest.class);

        verify(melhorEnvioClient).calculate(captor.capture());
        return captor.getValue();
    }
}