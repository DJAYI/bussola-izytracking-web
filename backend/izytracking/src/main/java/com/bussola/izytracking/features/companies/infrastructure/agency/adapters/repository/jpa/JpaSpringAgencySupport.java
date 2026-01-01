package com.bussola.izytracking.features.companies.infrastructure.agency.adapters.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.infrastructure.agency.adapters.repository.jpa.entities.JpaAgencyEntity;

public interface JpaSpringAgencySupport extends JpaRepository<JpaAgencyEntity, UUID> {

    boolean existsByUserId(UUID userId);

    Optional<JpaAgencyEntity> findByUserId(UUID userId);

    Optional<JpaAgencyEntity> findByDocumentNumberAndDocumentType(String documentNumber, DocumentType documentType);
}
