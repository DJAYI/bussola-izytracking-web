package com.bussola.izytracking.features.companies.application.transport_provider.dto;

import java.util.UUID;

public record RegisterTransportProviderResponse(
                UUID transportProviderId,
                UUID userId,
                String email,
                String displayName) {
}
