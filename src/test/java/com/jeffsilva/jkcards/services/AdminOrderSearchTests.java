package com.jeffsilva.jkcards.services;

import com.jeffsilva.jkcards.entities.Order;
import com.jeffsilva.jkcards.entities.User;
import com.jeffsilva.jkcards.entities.enums.OrderStatus;
import com.jeffsilva.jkcards.repositories.OrderRepository;
import com.jeffsilva.jkcards.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AdminOrderSearchTests {
    @Autowired OrderService service;
    @Autowired OrderRepository orders;
    @Autowired UserRepository users;

    private User client(String name) {
        User user = new User();
        user.setName(name);
        user.setEmail(name + "@example.test");
        return users.save(user);
    }
    private Order order(User client, OrderStatus status, String moment) {
        return orders.save(new Order(null, Instant.parse(moment), status, client, null));
    }
    @Test
    void combinesFiltersBeforePaginationAndIncludesTheWholeLastDay() {
        User maria = client("Search Maria");
        var first = order(maria, OrderStatus.PAID, "2026-09-20T03:00:00Z");
        var last = order(maria, OrderStatus.PAID, "2026-09-21T02:59:59Z");
        order(maria, OrderStatus.PAID, "2026-09-21T03:00:00Z");
        order(maria, OrderStatus.CANCELED, "2026-09-20T12:00:00Z");
        order(client("Other Client"), OrderStatus.PAID, "2026-09-20T12:00:00Z");
        var page = service.findFiltered(null, "search MARIA", OrderStatus.PAID,
                Instant.parse("2026-09-20T03:00:00Z"), Instant.parse("2026-09-21T03:00:00Z"),
                PageRequest.of(0, 1, Sort.by("id").descending()));
        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getContent().getFirst().getId()).isEqualTo(last.getId());
        var second = service.findFiltered(null, "search MARIA", OrderStatus.PAID,
                Instant.parse("2026-09-20T03:00:00Z"), Instant.parse("2026-09-21T03:00:00Z"),
                PageRequest.of(1, 1, Sort.by("id").descending()));
        assertThat(second.getContent().getFirst().getId()).isEqualTo(first.getId());
    }
    @Test
    void findsExactOrderNumberAndTreatsWildcardsAsLiteralText() {
        var user = client("Literal %_ Client");
        var order = order(user, OrderStatus.PAID, "2026-09-20T12:00:00Z");
        var byId = service.findFiltered(null, "#" + order.getId(), null, null, null, PageRequest.of(0, 10));
        assertThat(byId.getContent()).extracting("id").containsExactly(order.getId());
        var byName = service.findFiltered(null, "%_", null, null, null, PageRequest.of(0, 10));
        assertThat(byName.getContent()).extracting("id").containsExactly(order.getId());
    }
}
