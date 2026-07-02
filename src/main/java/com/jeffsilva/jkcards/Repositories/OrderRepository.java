package com.jeffsilva.jkcards.Repositories;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByClientId(Long clientId, Pageable pageable);

    Long countByStatus(OrderStatus status);

    @Query("""
            SELECT COALESCE(SUM(item.price * item.quantity), 0)
            FROM OrderItem item 
            WHERE item.id.order.status IN :statuses
            """)
    Double sumRevenueByStatuses(List<OrderStatus> statuses);

    @Query("""
            SELECT COUNT(obj.id) 
            FROM Order obj
            WHERE obj.status IN :statuses
            """)
    Long countOrdersByStatuses(List<OrderStatus> statuses);

    @Query("""
            SELECT obj.status, COUNT(obj.id)
            FROM Order obj
            GROUP BY obj.status
            ORDER BY obj.status
           """)
    List<Object[]> countOrdersGroupByStatus();



}
