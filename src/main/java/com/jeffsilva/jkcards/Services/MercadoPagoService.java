package com.jeffsilva.jkcards.Services;

import com.jeffsilva.jkcards.Services.exceptions.DataBaseException;
import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.Payment;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public Payment createPaymentPreference(Order order) {

        System.out.println("TOKEN MERCADO PAGO LIDO? " + (accessToken == null ? "NULL" : "TAMANHO: " + accessToken.length()));

        if (accessToken == null || accessToken.isBlank()) {
            throw new DataBaseException("Mercado Pago access token is not configured");
        }

        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            List<PreferenceItemRequest> items = new ArrayList<>();

            for (OrderItem orderItem : order.getItems()) {
                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .id(String.valueOf(orderItem.getProduct().getId()))
                        .title(orderItem.getProduct().getName())
                        .quantity(orderItem.getQuantity())
                        .unitPrice(BigDecimal.valueOf(orderItem.getPrice()))
                        .build();

                items.add(itemRequest);
            }

            String orderDetailsUrl = frontendUrl + "/pedidos/" + order.getId();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(orderDetailsUrl)
                    .pending(orderDetailsUrl)
                    .failure(orderDetailsUrl)
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .externalReference(String.valueOf(order.getId()))
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setMercadoPagoPreferenceId(preference.getId());
            payment.setCheckoutUrl(preference.getInitPoint());
            payment.setPaymentStatus("PENDING");

            return payment;
        }
        catch (MPApiException e) {
            throw new DataBaseException("Mercado Pago API error: " + e.getMessage());
        }
        catch (MPException e) {
            throw new DataBaseException("Mercado Pago error: " + e.getMessage());
        }
    }
}