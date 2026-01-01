package com.bussola.izytracking.features.companies.application.agency.usecases;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.enums.UserRole;
import com.bussola.izytracking.features.auth.domain.enums.UserStatus;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.companies.application.agency.dto.RegisterAgencyResponse;
import com.bussola.izytracking.features.companies.domain.entities.agencies.Agency;
import com.bussola.izytracking.features.companies.domain.exceptions.AgencyAlreadyExistsException;
import com.bussola.izytracking.features.companies.domain.repository.AgencyRepository;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.RegisterAgencyCommand;

@Service
public class RegisterAgencyUsecase {

    private final AgencyRepository agencyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterAgencyUsecase(
            AgencyRepository agencyRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.agencyRepository = agencyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterAgencyResponse execute(RegisterAgencyCommand command) {
        // Check if agency with same legal documentation already exists
        agencyRepository.findByLegalDocumentation(
                command.legalDocumentationDetails().getDocumentNumber(),
                command.legalDocumentationDetails().getDocumentType())
                .ifPresent(existing -> {
                    throw new AgencyAlreadyExistsException(
                            command.legalDocumentationDetails().getDocumentNumber());
                });

        // Create the user first
        User user = createUser(command);
        User savedUser = userRepository.save(user);

        // Create the agency linked to the user
        Agency agency = new Agency(
                command.legalDocumentationDetails(),
                command.addressDetails(),
                command.contactInformation(),
                savedUser.getId());

        Agency savedAgency = agencyRepository.save(agency);

        return new RegisterAgencyResponse(
                savedAgency.getId(),
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getDisplayName());
    }

    private User createUser(RegisterAgencyCommand command) {
        User user = new User();
        user.setDisplayName(command.displayName());
        user.setEmail(command.email());
        user.setPasswordHash(passwordEncoder.encode(command.password()));
        user.setRole(UserRole.AGENCY);
        user.setStatus(UserStatus.PENDING_ACTIVATION);
        return user;
    }
}
