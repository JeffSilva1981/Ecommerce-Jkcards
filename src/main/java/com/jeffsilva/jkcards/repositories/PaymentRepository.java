package com.jeffsilva.jkcards.repositories;

import com.jeffsilva.jkcards.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByMercadoPagoPreferenceId(String mercadoPagoPreferenceId);
}