package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.services.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class PaymentWebhookControllerTest {

    private static final String TEST_SECRET = "segredo-falso-apenas-para-teste";

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentWebhookController controller;

    @BeforeEach
    void configureWebhookSecret() {
        ReflectionTestUtils.setField(controller, "webhookSecret", TEST_SECRET);
    }

    @Test
    void aceitaAssinaturaValida() throws Exception {
        Long paymentId = 123456L;
        String requestId = "request-teste";
        String signature = createSignature(
                TEST_SECRET,
                paymentId.toString(),
                requestId
        );

        var response = controller.mercadoPagoWebhook(
                signature,
                requestId,
                "payment",
                paymentId,
                null
        );

        assertEquals(HttpStatus.OK.value(), response.getStatusCode().value());
        verify(paymentService).processMercadoPagoPayment(paymentId);
    }

    @Test
    void rejeitaAssinaturaInvalida() throws Exception {
        Long paymentId = 123456L;
        String requestId = "request-teste";

        // A assinatura foi gerada para outro ID de pagamento.
        String signature = createSignature(
                TEST_SECRET,
                "999999",
                requestId
        );

        var response = controller.mercadoPagoWebhook(
                signature,
                requestId,
                "payment",
                paymentId,
                null
        );

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatusCode().value());
        verifyNoInteractions(paymentService);
    }

    private String createSignature(
            String secret,
            String dataId,
            String requestId
    ) throws Exception {
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String manifest = "id:" + dataId
                + ";request-id:" + requestId
                + ";ts:" + timestamp
                + ";";

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        ));

        String hash = HexFormat.of().formatHex(
                mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8))
        );

        return "ts=" + timestamp + ",v1=" + hash;
    }
}