package com.bussola.izytracking.features.auth.application.dto;

public record UserResponse(String email, String displayName, String role, String status, String id) {
}
