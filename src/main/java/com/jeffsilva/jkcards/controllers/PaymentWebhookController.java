package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.services.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mercadopago.exceptions.MPInvalidWebhookSignatureException;
import com.mercadopago.webhook.WebhookSignatureValidator;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentWebhookController {

    private static final Logger log =
            LoggerFactory.getLogger(PaymentWebhookController.class);

    @Autowired
    private PaymentService paymentService;

    @Value("${mercadopago.webhook-secret:}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<Void> mercadoPagoWebhook(
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "data.id", required = false) Long dataId,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        String eventType = type;

        if (eventType == null
                && body != null
                && body.get("type") instanceof String bodyType) {
            eventType = bodyType;
        }

        // Eventos de outros tipos não precisam ser processados.
        if (!"payment".equalsIgnoreCase(eventType)) {
            return ResponseEntity.ok().build();
        }

        Long paymentId = dataId;

        try {
            if (paymentId == null && body != null) {
                paymentId = extractPaymentIdFromBody(body);
            }
        } catch (NumberFormatException e) {
            log.warn("Webhook com identificador de pagamento inválido");
            return ResponseEntity.badRequest().build();
        }

        if (paymentId == null || paymentId <= 0) {
            log.warn("Webhook de pagamento sem identificador válido");
            return ResponseEntity.badRequest().build();
        }

        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.error("Segredo do webhook do Mercado Pago não configurado");
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .build();
        }

        try {
            WebhookSignatureValidator.validate(
                    xSignature,
                    xRequestId,
                    dataId == null ? null : dataId.toString(),
                    webhookSecret
            );
        } catch (MPInvalidWebhookSignatureException e) {
            log.warn("Assinatura inválida no webhook do Mercado Pago");
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        try {
            paymentService.processMercadoPagoPayment(paymentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error(
                    "Falha ao processar webhook do Mercado Pago. Payment ID: {}",
                    paymentId,
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    private Long extractPaymentIdFromBody(Map<String, Object> body) {
        Object data = body.get("data");

        if (data instanceof Map<?, ?> dataMap) {
            Object id = dataMap.get("id");

            if (id != null) {
                return parsePaymentId(id);
            }
        }

        Object id = body.get("id");

        if (id != null) {
            return parsePaymentId(id);
        }

        return null;
    }

    private Long parsePaymentId(Object id) {
        if (id instanceof Number || id instanceof String) {
            return Long.valueOf(id.toString().trim());
        }

        throw new NumberFormatException(
                "Tipo inválido para o identificador de pagamento"
        );
    }
}