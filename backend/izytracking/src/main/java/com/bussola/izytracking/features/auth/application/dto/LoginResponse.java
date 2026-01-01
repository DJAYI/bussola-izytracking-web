package com.bussola.izytracking.features.auth.application.dto;

public record LoginResponse(
                String email,
                String displayName,
                String role,
                String accessToken,
                String refreshToken) {
}
