package com.jeffsilva.jkcards.Dtos;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import jakarta.validation.constraints.NotEmpty;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {

    private Long id;
    private Instant moment;
    private OrderStatus status;
    private ClientDto client;
    private PaymentDto payment;

    @NotEmpty(message = "The order must belong to at least one item.")
    private List<OrderItemDto> items = new ArrayList<>();

    public OrderDto(){

    }

    public OrderDto(Long id, Instant moment, OrderStatus status, ClientDto client, PaymentDto payment) {
        this.id = id;
        this.moment = moment;
        this.status = status;
        this.client = client;
        this.payment = payment;
    }

    public OrderDto(Order entity) {
        id = entity.getId();
        moment = entity.getMoment();
        status = entity.getStatus();
        client = new ClientDto(entity.getClient());
        payment = (entity.getPayment() == null) ? null : new PaymentDto(entity.getPayment());

        for (OrderItem item : entity.getItems()){
            OrderItemDto orderItemDto = new OrderItemDto(item);
            items.add(orderItemDto);
        }
    }

    public Long getId() {
        return id;
    }

    public Instant getMoment() {
        return moment;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public ClientDto getClient() {
        return client;
    }

    public PaymentDto getPayment() {
        return payment;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public Double getTotal(){
        Double sum = 0.0;

        for (OrderItemDto item : items){
            sum += item.getSubTotal();
        }
        return sum;
    }
}
