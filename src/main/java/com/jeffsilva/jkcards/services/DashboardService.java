package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.dtos.CategoryInventoryDto;
import com.jeffsilva.jkcards.dtos.DashboardDto;
import com.jeffsilva.jkcards.dtos.DashboardStatusDto;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.ProductRepository;
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
        List<OrderStatus> revenueStatuses = List.of(
                OrderStatus.PAID,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED
        );

        Long ordersCount = orderRepository.count();

        Double grossRevenue =
                orderRepository.sumRevenueByStatuses(revenueStatuses);

        Long billedOrdersCount =
                orderRepository.countOrdersByStatuses(revenueStatuses);

        Double netRevenue = grossRevenue;

        Double averageTicket = billedOrdersCount > 0
                ? grossRevenue / billedOrdersCount
                : 0.0;

        // Os indicadores de estoque incluem produtos disponíveis e ocultos.
        Double inventoryValue = productRepository.sumInventoryValue();
        Long productsCount = productRepository.count();
        Long stockUnits = productRepository.sumStockUnits();

        Long outOfStockProducts =
                productRepository.countOutOfStockProducts();

        Long waitingPaymentOrders =
                orderRepository.countByStatus(OrderStatus.WAITING_PAYMENT);

        List<DashboardStatusDto> byStatus = new ArrayList<>();

        List<Object[]> ordersByStatus =
                orderRepository.countOrdersGroupByStatus();

        for (Object[] row : ordersByStatus) {
            OrderStatus status = (OrderStatus) row[0];
            Long count = ((Number) row[1]).longValue();

            byStatus.add(new DashboardStatusDto(status, count));
        }

        List<CategoryInventoryDto> inventoryByCategory = new ArrayList<>();

        List<Object[]> categoryRows =
                productRepository.inventoryByCategory();

        for (Object[] row : categoryRows) {
            Long categoryId = ((Number) row[0]).longValue();
            String categoryName = (String) row[1];
            Double categoryInventoryValue = ((Number) row[2]).doubleValue();
            Long categoryStockUnits = ((Number) row[3]).longValue();

            inventoryByCategory.add(
                    new CategoryInventoryDto(
                            categoryId,
                            categoryName,
                            categoryInventoryValue,
                            categoryStockUnits
                    )
            );
        }

        DashboardDto dashboardDto = new DashboardDto(
                ordersCount,
                grossRevenue,
                netRevenue,
                averageTicket,
                inventoryValue,
                productsCount,
                stockUnits,
                outOfStockProducts,
                waitingPaymentOrders,
                byStatus
        );

        dashboardDto.setInventoryByCategory(inventoryByCategory);

        return dashboardDto;
    }
}