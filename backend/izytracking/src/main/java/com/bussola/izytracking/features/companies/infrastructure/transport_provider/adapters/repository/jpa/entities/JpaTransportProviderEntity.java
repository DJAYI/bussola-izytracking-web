package com.bussola.izytracking.features.companies.infrastructure.transport_provider.adapters.repository.jpa.entities;

import java.util.UUID;

import com.bussola.izytracking.features.companies.domain.enums.DocumentType;
import com.bussola.izytracking.features.companies.domain.enums.PersonType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transport_providers")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JpaTransportProviderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    // Legal documentation
    @Column(nullable = false, unique = true)
    private String documentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonType personType;

    // Address details
    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false, length = 3)
    private String country;

    // Contact information
    @Column(nullable = false, unique = true)
    private String contactEmail;
    @Column(unique = true)
    private String phoneNumber;
    @Column(unique = true)
    private String mobileNumber;
}
