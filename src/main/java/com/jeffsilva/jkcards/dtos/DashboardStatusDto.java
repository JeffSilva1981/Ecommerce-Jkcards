package com.jeffsilva.jkcards.dtos;

import com.jeffsilva.jkcards.entities.enums.OrderStatus;

public class DashboardStatusDto {

    private OrderStatus status;
    private Long count;

    public DashboardStatusDto(){

    }

    public DashboardStatusDto(OrderStatus status, Long count) {
        this.status = status;
        this.count = count;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Long getCount() {
        return count;
    }
}
