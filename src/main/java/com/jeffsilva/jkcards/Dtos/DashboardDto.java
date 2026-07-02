package com.jeffsilva.jkcards.Dtos;

import java.util.ArrayList;
import java.util.List;

public class DashboardDto {

    private Long ordersCount;
    private Double grossRevenue;
    private Double netRevenue;
    private Double averageTicket;
    private Double inventoryValue;
    private Long productsCount;
    private Long stockUnits;
    private Long outOfStockProducts;
    private Long waitingPaymentOrders;
    private List<DashboardStatusDto> byStatus = new ArrayList<>();

    public DashboardDto(){

    }

    public DashboardDto(Long ordersCount, Double grossRevenue, Double netRevenue,
                        Double averageTicket, Double inventoryValue, Long productsCount,
                        Long stockUnits, Long outOfStockProducts, Long waitingPaymentOrders,
                        List<DashboardStatusDto> byStatus) {

        this.ordersCount = ordersCount;
        this.grossRevenue = grossRevenue;
        this.netRevenue = netRevenue;
        this.averageTicket = averageTicket;
        this.inventoryValue = inventoryValue;
        this.productsCount = productsCount;
        this.stockUnits = stockUnits;
        this.outOfStockProducts = outOfStockProducts;
        this.waitingPaymentOrders = waitingPaymentOrders;
        this.byStatus = byStatus;
    }

    public Long getOrdersCount() {
        return ordersCount;
    }

    public Double getGrossRevenue() {
        return grossRevenue;
    }

    public Double getNetRevenue() {
        return netRevenue;
    }

    public Double getAverageTicket() {
        return averageTicket;
    }

    public Double getInventoryValue() {
        return inventoryValue;
    }

    public Long getProductsCount() {
        return productsCount;
    }

    public Long getStockUnits() {
        return stockUnits;
    }

    public Long getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public Long getWaitingPaymentOrders() {
        return waitingPaymentOrders;
    }

    public List<DashboardStatusDto> getByStatus() {
        return byStatus;
    }
}
