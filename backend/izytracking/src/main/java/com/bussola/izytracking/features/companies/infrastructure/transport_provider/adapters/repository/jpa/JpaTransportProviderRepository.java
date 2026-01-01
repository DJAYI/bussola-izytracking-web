package com.bussola.izytracking.features.companies.infrastructure.transport_provider.adapters.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.value_objects.AddressDetails;
import com.bussola.izytracking.features.companies.domain.value_objects.ContactInformation;
import com.bussola.izytracking.features.companies.domain.value_objects.LegalDocumentationDetails;
import com.bussola.izytracking.features.companies.infrastructure.transport_provider.adapters.repository.jpa.entities.JpaTransportProviderEntity;

@Repository
public class JpaTransportProviderRepository implements TransportProviderRepository {

    private final JpaSpringTransportProviderSupport jpaSpringTransportProviderSupport;

    public JpaTransportProviderRepository(JpaSpringTransportProviderSupport jpaSpringTransportProviderSupport) {
        this.jpaSpringTransportProviderSupport = jpaSpringTransportProviderSupport;
    }

    @Override
    public TransportProvider save(TransportProvider agency) {
        JpaTransportProviderEntity entity = toNewEntity(agency);
        JpaTransportProviderEntity savedEntity = jpaSpringTransportProviderSupport.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public boolean existsByUserId(UUID userId) {
        return jpaSpringTransportProviderSupport.existsByUserId(userId);
    }

    @Override
    public Optional<TransportProvider> findById(UUID id) {
        return jpaSpringTransportProviderSupport.findById(id)
                .map(this::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        jpaSpringTransportProviderSupport.deleteById(id);
    }

    @Override
    public TransportProvider update(TransportProvider agency) {
        JpaTransportProviderEntity entity = toEntity(agency);
        JpaTransportProviderEntity updatedEntity = jpaSpringTransportProviderSupport.save(entity);
        return toDomain(updatedEntity);
    }

    @Override
    public Optional<TransportProvider> findByLegalDocumentation(String documentNumber, DocumentType documentType) {
        return jpaSpringTransportProviderSupport.findByDocumentNumberAndDocumentType(documentNumber, documentType)
                .map(this::toDomain);
    }

    @Override
    public Optional<TransportProvider> findByUserId(UUID userId) {
        return jpaSpringTransportProviderSupport.findByUserId(userId)
                .map(this::toDomain);
    }

    @Override
    public Page<TransportProvider> findAll(int page, int size, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return jpaSpringTransportProviderSupport.findAll(pageable).map(this::toDomain);
    }

    /**
     * Converts domain to JPA entity WITHOUT ID (for new inserts - let JPA generate
     * ID)
     */
    private JpaTransportProviderEntity toNewEntity(TransportProvider agency) {
        return JpaTransportProviderEntity.builder()
                .userId(agency.getUserId())
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
    private JpaTransportProviderEntity toEntity(TransportProvider agency) {
        return JpaTransportProviderEntity.builder()
                .id(agency.getId())
                .userId(agency.getUserId())
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

    private TransportProvider toDomain(JpaTransportProviderEntity entity) {
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

        return TransportProvider.reconstitute(
                entity.getId(),
                legalDocs,
                address,
                contact,
                entity.getUserId());
    }
}
