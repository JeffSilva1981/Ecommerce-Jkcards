package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.OrderItem;
import com.jeffsilva.jkcards.entities.OrderItemPk;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPk> {

}
