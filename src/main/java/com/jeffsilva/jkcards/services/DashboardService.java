package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.DashboardDto;
import com.jeffsilva.jkcards.dtos.DashboardStatusDto;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardDto getSummary() {

        List<OrderStatus> revenueStatuses = List.of(OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

        Long ordersCount = orderRepository.count();
        Double grossRevenue = orderRepository.sumRevenueByStatuses(revenueStatuses);
        Long billedOrdersCount = orderRepository.countOrdersByStatuses(revenueStatuses);
        Double netRevenue = grossRevenue;
        Double averageTicket;

        if (billedOrdersCount > 0) {
            averageTicket = grossRevenue / billedOrdersCount;
        } else {
            averageTicket = 0.0;
        }

        Double inventoryValue = productRepository.sumInventoryValue();
        Long productsCount = productRepository.count();
        Long stockUnits = productRepository.sumStockUnits();
        Long outOfStockProducts = productRepository.countOutOfStockProducts();
        Long waitingPaymentOrders = orderRepository.countByStatus(OrderStatus.WAITING_PAYMENT);

        List<DashboardStatusDto> byStatus = new ArrayList<>();
        List<Object[]> ordersByStatus = orderRepository.countOrdersGroupByStatus();

        for (Object[] row : ordersByStatus) {
            OrderStatus status = (OrderStatus) row[0];
            Long count = (Long) row[1];
            DashboardStatusDto dto = new DashboardStatusDto(status, count);
            byStatus.add(dto);
        }

        DashboardDto dashboardDto = new DashboardDto(
                ordersCount, grossRevenue, netRevenue, averageTicket,
                inventoryValue, productsCount, stockUnits, outOfStockProducts,
                waitingPaymentOrders, byStatus);

        return dashboardDto;
    }
}
