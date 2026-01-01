package com.bussola.izytracking.features.auth.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.bussola.izytracking.features.auth.domain.entities.User;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    void deleteById(UUID id);

    User update(User user);

    void desactivateUser(UUID id);
}
