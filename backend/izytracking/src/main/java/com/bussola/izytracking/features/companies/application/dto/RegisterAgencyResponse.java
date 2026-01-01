package com.bussola.izytracking.features.companies.application.dto;

import java.util.UUID;

public record RegisterAgencyResponse(
        UUID agencyId,
        UUID userId,
        String email,
        String displayName) {
}
