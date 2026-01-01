package com.bussola.izytracking.features.companies.application.transport_provider.usecases;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.enums.UserRole;
import com.bussola.izytracking.features.auth.domain.enums.UserStatus;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.companies.application.transport_provider.dto.RegisterTransportProviderResponse;
import com.bussola.izytracking.features.companies.domain.entities.transport_providers.TransportProvider;
import com.bussola.izytracking.features.companies.domain.exceptions.TransportProviderAlreadyExistsException;
import com.bussola.izytracking.features.companies.domain.repository.TransportProviderRepository;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.RegisterTransportProviderCommand;

@Service
public class RegisterTransportProviderUsecase {

    private final TransportProviderRepository transportProviderRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterTransportProviderUsecase(
            TransportProviderRepository transportProviderRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.transportProviderRepository = transportProviderRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterTransportProviderResponse execute(RegisterTransportProviderCommand command) {
        // Check if agency with same legal documentation already exists
        transportProviderRepository.findByLegalDocumentation(
                command.legalDocumentationDetails().getDocumentNumber(),
                command.legalDocumentationDetails().getDocumentType())
                .ifPresent(existing -> {
                    throw new TransportProviderAlreadyExistsException(
                            command.legalDocumentationDetails().getDocumentNumber());
                });

        // Create the user first
        User user = createUser(command);
        User savedUser = userRepository.save(user);

        // Create the agency linked to the user
        TransportProvider transportProvider = new TransportProvider(
                command.legalDocumentationDetails(),
                command.addressDetails(),
                command.contactInformation(),
                savedUser.getId());

        TransportProvider savedTransportProvider = transportProviderRepository.save(transportProvider);

        return new RegisterTransportProviderResponse(
                savedTransportProvider.getId(),
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getDisplayName());
    }

    private User createUser(RegisterTransportProviderCommand command) {
        User user = new User();
        user.setDisplayName(command.displayName());
        user.setEmail(command.email());
        user.setPasswordHash(passwordEncoder.encode(command.password()));
        user.setRole(UserRole.AGENCY);
        user.setStatus(UserStatus.PENDING_ACTIVATION);
        return user;
    }
}
