package com.bussola.izytracking.features.auth.infrastructure.adapters.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bussola.izytracking.features.auth.infrastructure.adapters.repository.jpa.entities.JpaUserEntity;

public interface JpaSpringUserSupport extends JpaRepository<JpaUserEntity, UUID> {
    Optional<JpaUserEntity> findByEmail(String email);
}
