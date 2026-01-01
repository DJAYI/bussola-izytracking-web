package com.bussola.izytracking.features.companies.infrastructure.transport_provider.adapters.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.infrastructure.transport_provider.adapters.repository.jpa.entities.JpaTransportProviderEntity;

public interface JpaSpringTransportProviderSupport extends JpaRepository<JpaTransportProviderEntity, UUID> {

    boolean existsByUserId(UUID userId);

    Optional<JpaTransportProviderEntity> findByUserId(UUID userId);

    Optional<JpaTransportProviderEntity> findByDocumentNumberAndDocumentType(String documentNumber, DocumentType documentType);
}
