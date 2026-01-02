package com.bussola.izytracking.features.companies.infrastructure.agency.adapters.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;
import com.bussola.izytracking.features.companies.infrastructure.agency.adapters.repository.jpa.entities.JpaAgencyEntity;

@Repository
public class JpaAgencyRepository implements AgencyRepository {

    private final JpaSpringAgencySupport jpaSpringAgencySupport;

    public JpaAgencyRepository(JpaSpringAgencySupport jpaSpringAgencySupport) {
        this.jpaSpringAgencySupport = jpaSpringAgencySupport;
    }

    @Override
    public Agency save(Agency agency) {
        JpaAgencyEntity entity = toNewEntity(agency);
        JpaAgencyEntity savedEntity = jpaSpringAgencySupport.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public boolean existsByUserId(UUID userId) {
        return jpaSpringAgencySupport.existsByUserId(userId);
    }

    @Override
    public Optional<Agency> findById(UUID id) {
        return jpaSpringAgencySupport.findById(id)
                .map(this::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        jpaSpringAgencySupport.deleteById(id);
    }

    @Override
    public Agency update(Agency agency) {
        JpaAgencyEntity entity = toEntity(agency);
        JpaAgencyEntity updatedEntity = jpaSpringAgencySupport.save(entity);
        return toDomain(updatedEntity);
    }

    @Override
    public Optional<Agency> findByLegalDocumentation(String documentNumber, DocumentType documentType) {
        return jpaSpringAgencySupport.findByDocumentNumberAndDocumentType(documentNumber, documentType)
                .map(this::toDomain);
    }

    @Override
    public Optional<Agency> findByUserId(UUID userId) {
        return jpaSpringAgencySupport.findByUserId(userId)
                .map(this::toDomain);
    }

    @Override
    public Page<Agency> findAll(int page, int size, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return jpaSpringAgencySupport.findAll(pageable).map(this::toDomain);
    }

    /**
     * Converts domain to JPA entity WITHOUT ID (for new inserts - let JPA generate
     * ID)
     */
    private JpaAgencyEntity toNewEntity(Agency agency) {
        return JpaAgencyEntity.builder()
                .userId(agency.getUserId())
                .displayName(agency.getDisplayName())
                // Legal documentation
                .documentNumber(agency.getLegalDocumentationDetails().getDocumentNumber())
                .documentType(agency.getLegalDocumentationDetails().getDocumentType())
                .personType(agency.getLegalDocumentationDetails().getPersonType())
                // Address
                .street(agency.getAddressDetails().getStreet())
                .city(agency.getAddressDetails().getCity())
                .state(agency.getAddressDetails().getState())
                .postalCode(agency.getAddressDetails().getPostalCode())
                .country(agency.getAddressDetails().getCountry())
                // Contact
                .contactEmail(agency.getContactInformation().getEmail())
                .phoneNumber(agency.getContactInformation().getPhoneNumber())
                .mobileNumber(agency.getContactInformation().getMobileNumber())
                .build();
    }

    /**
     * Converts domain to JPA entity WITH ID (for updates)
     */
    private JpaAgencyEntity toEntity(Agency agency) {
        return JpaAgencyEntity.builder()
                .id(agency.getId())
                .userId(agency.getUserId())
                .displayName(agency.getDisplayName())
                // Legal documentation
                .documentNumber(agency.getLegalDocumentationDetails().getDocumentNumber())
                .documentType(agency.getLegalDocumentationDetails().getDocumentType())
                .personType(agency.getLegalDocumentationDetails().getPersonType())
                // Address
                .street(agency.getAddressDetails().getStreet())
                .city(agency.getAddressDetails().getCity())
                .state(agency.getAddressDetails().getState())
                .postalCode(agency.getAddressDetails().getPostalCode())
                .country(agency.getAddressDetails().getCountry())
                // Contact
                .contactEmail(agency.getContactInformation().getEmail())
                .phoneNumber(agency.getContactInformation().getPhoneNumber())
                .mobileNumber(agency.getContactInformation().getMobileNumber())
                .build();
    }

    private Agency toDomain(JpaAgencyEntity entity) {
        LegalDocumentationDetails legalDocs = new LegalDocumentationDetails(
                entity.getDocumentNumber(),
                entity.getDocumentType(),
                entity.getPersonType());

        AddressDetails address = new AddressDetails(
                entity.getStreet(),
                entity.getCity(),
                entity.getState(),
                entity.getPostalCode(),
                entity.getCountry());

        ContactInformation contact = new ContactInformation(
                entity.getContactEmail(),
                entity.getPhoneNumber(),
                entity.getMobileNumber());

        return Agency.reconstitute(
                entity.getId(),
                entity.getDisplayName(),
                legalDocs,
                address,
                contact,
                entity.getUserId());
    }
}
