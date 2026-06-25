package com.jeffsilva.jkcards.Controllers;

import com.jeffsilva.jkcards.Services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentWebhookController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> mercadoPagoWebhook(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "data.id", required = false) Long dataId
    ) {
        if ("payment".equalsIgnoreCase(type) && dataId != null) {
            paymentService.processMercadoPagoPayment(dataId);
        }

        return ResponseEntity.ok().build();
    }
}