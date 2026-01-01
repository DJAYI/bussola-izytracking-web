package com.bussola.izytracking.features.auth.infrastructure.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.enums.UserStatus;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.infrastructure.repository.jpa.entities.JpaUserEntity;

@Repository
public class JpaUserRepository implements UserRepository {
    private final JpaSpringUserSupport jpaSpringUserSupport;

    public JpaUserRepository(JpaSpringUserSupport jpaSpringUserSupport) {
        this.jpaSpringUserSupport = jpaSpringUserSupport;
    }

    @Override
    public User save(User user) {
        JpaUserEntity entity = toEntity(user);
        JpaUserEntity savedEntity = jpaSpringUserSupport.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaSpringUserSupport.findById(id)
                .map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaSpringUserSupport.findByEmail(email)
                .map(this::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        jpaSpringUserSupport.deleteById(id);
    }

    @Override
    public User update(User user) {
        JpaUserEntity entity = toEntity(user);
        JpaUserEntity updatedEntity = jpaSpringUserSupport.save(entity);
        return toDomain(updatedEntity);
    }

    private JpaUserEntity toEntity(User user) {
        return JpaUserEntity.builder()
                .displayName(user.getDisplayName())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    private User toDomain(JpaUserEntity entity) {
        User user = new User();
        user.setId(entity.getId());
        user.setDisplayName(entity.getDisplayName());
        user.setEmail(entity.getEmail());
        user.setPasswordHash(entity.getPassword());
        user.setRole(entity.getRole());
        user.setStatus(entity.getStatus());
        return user;
    }

    @Override
    public void desactivateUser(UUID id) {
        jpaSpringUserSupport.findById(id).ifPresent(entity -> {
            entity.setStatus(UserStatus.INACTIVE);
            jpaSpringUserSupport.save(entity);
        });
    }
}
