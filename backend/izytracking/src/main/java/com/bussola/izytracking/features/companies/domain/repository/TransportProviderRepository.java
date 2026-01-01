package com.bussola.izytracking.features.companies.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.enums.DocumentType;

public interface TransportProviderRepository {
    TransportProvider save(TransportProvider transportProvider);

    boolean existsByUserId(UUID userId);

    Optional<TransportProvider> findById(UUID id);

    void deleteById(UUID id);

    TransportProvider update(TransportProvider transportProvider);

    Optional<TransportProvider> findByLegalDocumentation(String documentNumber, DocumentType documentType);

    Optional<TransportProvider> findByUserId(UUID userId);

    Page<TransportProvider> findAll(int page, int size, String sortBy, String sortDirection);
}
