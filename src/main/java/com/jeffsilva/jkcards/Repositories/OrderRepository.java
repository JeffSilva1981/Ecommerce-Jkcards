package com.jeffsilva.jkcards.Repositories;

import com.jeffsilva.jkcards.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {


}
