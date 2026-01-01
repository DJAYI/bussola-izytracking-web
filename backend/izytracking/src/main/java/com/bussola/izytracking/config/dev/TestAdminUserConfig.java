package com.bussola.izytracking.config.dev;

import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.enums.UserRole;
import com.bussola.izytracking.features.auth.domain.enums.UserStatus;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class TestAdminUserConfig {
    @Bean
    public CommandLineRunner createTestAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@demo.local";
            Optional<User> existing = userRepository.findByEmail(email);
            if (existing.isEmpty()) {
                User admin = new User();
                admin.setEmail(email);
                admin.setDisplayName("Administrador Demo");
                admin.setPasswordHash(passwordEncoder.encode("admin1234"));
                admin.setRole(UserRole.ADMIN);
                admin.setStatus(UserStatus.ACTIVE);
                userRepository.save(admin);
                System.out.println("Usuario admin de prueba creado: " + email + " / admin1234");
            } else {
                // No modificar ni actualizar el usuario existente
                System.out.println("Usuario admin de prueba ya existe: " + email);
            }
        };
    }
}
