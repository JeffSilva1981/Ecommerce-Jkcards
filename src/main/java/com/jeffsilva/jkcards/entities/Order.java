package com.jeffsilva.jkcards.entities;

import com.jeffsilva.jkcards.entities.enums.DeliveryMethod;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tb_order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private Instant moment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToMany(mappedBy = "id.order")
    private Set<OrderItem> items = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_method")
    private DeliveryMethod deliveryMethod;

    @Embedded
    private ShippingAddress shippingAddress;

    @Column(name = "shipping_service_id")
    private Long shippingServiceId;

    @Column(name = "shipping_service_name")
    private String shippingServiceName;

    @Column(name = "shipping_carrier")
    private String shippingCarrier;

    @Column(name = "shipping_price")
    private Double shippingPrice;

    @Column(name = "shipping_delivery_days")
    private Integer shippingDeliveryDays;

    public Order() {
    }

    public Order(
            Long id,
            Instant moment,
            OrderStatus status,
            User client,
            Payment payment) {

        this.id = id;
        this.moment = moment;
        this.status = status;
        this.client = client;
        this.payment = payment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getMoment() {
        return moment;
    }

    public void setMoment(Instant moment) {
        this.moment = moment;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Set<OrderItem> getItems() {
        return items;
    }

    public DeliveryMethod getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(DeliveryMethod deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Long getShippingServiceId() {
        return shippingServiceId;
    }

    public void setShippingServiceId(Long shippingServiceId) {
        this.shippingServiceId = shippingServiceId;
    }

    public String getShippingServiceName() {
        return shippingServiceName;
    }

    public void setShippingServiceName(String shippingServiceName) {
        this.shippingServiceName = shippingServiceName;
    }

    public String getShippingCarrier() {
        return shippingCarrier;
    }

    public void setShippingCarrier(String shippingCarrier) {
        this.shippingCarrier = shippingCarrier;
    }

    public Double getShippingPrice() {
        return shippingPrice;
    }

    public void setShippingPrice(Double shippingPrice) {
        this.shippingPrice = shippingPrice;
    }

    public Integer getShippingDeliveryDays() {
        return shippingDeliveryDays;
    }

    public void setShippingDeliveryDays(Integer shippingDeliveryDays) {
        this.shippingDeliveryDays = shippingDeliveryDays;
    }

    public List<Product> getProducts() {
        return items.stream()
                .map(OrderItem::getProduct)
                .toList();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Order order = (Order) o;
        return Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}