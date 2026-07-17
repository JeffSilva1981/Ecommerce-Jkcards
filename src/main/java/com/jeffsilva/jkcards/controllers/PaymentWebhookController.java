package com.jeffsilva.jkcards.controllers;

import com.jeffsilva.jkcards.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentWebhookController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> mercadoPagoWebhook(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "data.id", required = false) Long dataId,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        try {
            String eventType = type;
            Long paymentId = dataId;

            if (body != null) {
                if (eventType == null && body.get("type") instanceof String bodyType) {
                    eventType = bodyType;
                }

                if (paymentId == null) {
                    paymentId = extractPaymentIdFromBody(body);
                }
            }

            if ("payment".equalsIgnoreCase(eventType) && paymentId != null) {
                paymentService.processMercadoPagoPayment(paymentId);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Mercado Pago webhook ignored: " + e.getMessage());
            return ResponseEntity.ok().build();
        }
    }

    private Long extractPaymentIdFromBody(Map<String, Object> body) {
        Object data = body.get("data");

        if (data instanceof Map<?, ?> dataMap) {
            Object id = dataMap.get("id");

            if (id instanceof Number number) {
                return number.longValue();
            }

            if (id instanceof String text) {
                return Long.valueOf(text);
            }
        }

        Object id = body.get("id");

        if (id instanceof Number number) {
            return number.longValue();
        }

        if (id instanceof String text) {
            return Long.valueOf(text);
        }

        return null;
    }
}