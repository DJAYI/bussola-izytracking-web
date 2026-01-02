package com.bussola.izytracking.features.auth.application.dto;

import java.time.Instant;

public record UserResponse(String email, String displayName, String role, String status, String id, Instant createdAt) {
}
