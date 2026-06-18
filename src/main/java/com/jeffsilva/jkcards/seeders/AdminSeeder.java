package com.jeffsilva.jkcards.seeders;

import com.jeffsilva.jkcards.Repositories.RoleRepository;
import com.jeffsilva.jkcards.Repositories.UserRepository;
import com.jeffsilva.jkcards.entities.Role;
import com.jeffsilva.jkcards.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ROLE_ADMIN
        Role adminRole = roleRepository.findByAuthority("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setAuthority("ROLE_ADMIN");
                    return roleRepository.save(role);
                });

        // ROLE_OPERATOR
        roleRepository.findByAuthority("ROLE_OPERATOR")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setAuthority("ROLE_OPERATOR");
                    return roleRepository.save(role);
                });

        String adminEmail = "admin@jkcards.com";
        String adminName = "Admin";
        String adminPassword = "123456";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPhone("000000000");
            admin.setPassword(passwordEncoder.encode(adminPassword));

            admin.addRole(adminRole);

            userRepository.save(admin);

            System.out.println("ADMIN criado com sucesso!");
        } else {
            System.out.println("ADMIN já existe.");
        }
    }
}