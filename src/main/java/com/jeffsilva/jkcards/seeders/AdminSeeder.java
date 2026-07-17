package com.jeffsilva.jkcards.seeders;

import com.jeffsilva.jkcards.repositories.RoleRepository;
import com.jeffsilva.jkcards.repositories.UserRepository;
import com.jeffsilva.jkcards.entities.Role;
import com.jeffsilva.jkcards.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    public AdminSeeder(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        Role adminRole = createRoleIfNotExists("ROLE_ADMIN");
        createRoleIfNotExists("ROLE_OPERATOR");

        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            User admin = new User();
            admin.setName("Admin");
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

    private Role createRoleIfNotExists(String authority) {
        return roleRepository.findByAuthority(authority)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setAuthority(authority);
                    return roleRepository.save(role);
                });
    }
}