package com.bussola.izytracking.features.companies.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.enums.DocumentType;

public interface AgencyRepository {
    Agency save(Agency agency);

    boolean existsByUserId(UUID userId);

    Optional<Agency> findById(UUID id);

    void deleteById(UUID id);

    Agency update(Agency agency);

    Optional<Agency> findByLegalDocumentation(String documentNumber, DocumentType documentType);

    Page<Agency> findAll(int page, int size, String sortBy, String sortDirection);
}
