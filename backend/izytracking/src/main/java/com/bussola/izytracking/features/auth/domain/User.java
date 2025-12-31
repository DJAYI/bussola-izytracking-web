package com.bussola.izytracking.features.auth.domain;

import java.util.UUID;

import com.bussola.izytracking.features.auth.domain.enums.UserRole;
import com.bussola.izytracking.features.auth.domain.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {

    private UUID id;
    private String displayName;
    private String email;

    @JsonIgnore
    private String passwordHash;

    private UserRole role;
    private UserStatus status;

    public User() {
        this.id = UUID.randomUUID();
        this.status = UserStatus.PENDING_ACTIVATION;
    }

    public User(String displayName, String email, String passwordHash, UserRole role) {
        this.displayName = displayName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

}
