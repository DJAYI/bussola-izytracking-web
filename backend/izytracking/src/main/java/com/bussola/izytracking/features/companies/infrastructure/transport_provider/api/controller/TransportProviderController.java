package com.bussola.izytracking.features.companies.infrastructure.transport_provider.api.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.config.api.dto.PaginatedResponse;
import com.bussola.izytracking.features.auth.domain.entities.DomainUserDetails;
import com.bussola.izytracking.features.companies.application.transport_provider.dto.RegisterTransportProviderResponse;
import com.bussola.izytracking.features.companies.application.transport_provider.dto.TransportProviderResponse;
import com.bussola.izytracking.features.companies.application.transport_provider.dto.UpdateMyTransportProviderRequest;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.GetMyTransportProviderProfileUsecase;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.ListTransportProviderUsecase;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.ModifyMyTransportProviderInformationUsecase;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.ModifyTransportProviderInformationUsecase;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.RegisterTransportProviderUsecase;
import com.bussola.izytracking.features.companies.application.transport_provider.usecases.ViewTransportProviderProfileUsecase;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.ModifyMyTransportProviderInformationCommand;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.ModifyTransportProviderInformationCommand;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.commands.RegisterTransportProviderCommand;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.GetMyTransportProviderProfileQuery;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.ListTransportProvidersQuery;
import com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries.ViewTransportProviderProfileQuery;

@RestController
@RequestMapping("/api/transport-providers")
public class TransportProviderController {

    private final RegisterTransportProviderUsecase registerTransportProviderUsecase;
    private final ViewTransportProviderProfileUsecase viewTransportProviderProfileUsecase;
    private final ModifyTransportProviderInformationUsecase modifyTransportProviderInformationUsecase;
    private final ModifyMyTransportProviderInformationUsecase modifyMyTransportProviderInformationUsecase;
    private final ListTransportProviderUsecase listTransportProviderUsecase;
    private final GetMyTransportProviderProfileUsecase getMyTransportProviderProfileUsecase;

    public TransportProviderController(
            RegisterTransportProviderUsecase registerTransportProviderUsecase,
            ViewTransportProviderProfileUsecase viewTransportProviderProfileUsecase,
            ModifyTransportProviderInformationUsecase modifyTransportProviderInformationUsecase,
            ModifyMyTransportProviderInformationUsecase modifyMyTransportProviderInformationUsecase,
            ListTransportProviderUsecase listTransportProviderUsecase,
            GetMyTransportProviderProfileUsecase getMyTransportProviderProfileUsecase) {
        this.registerTransportProviderUsecase = registerTransportProviderUsecase;
        this.viewTransportProviderProfileUsecase = viewTransportProviderProfileUsecase;
        this.modifyTransportProviderInformationUsecase = modifyTransportProviderInformationUsecase;
        this.modifyMyTransportProviderInformationUsecase = modifyMyTransportProviderInformationUsecase;
        this.listTransportProviderUsecase = listTransportProviderUsecase;
        this.getMyTransportProviderProfileUsecase = getMyTransportProviderProfileUsecase;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegisterTransportProviderResponse>> register(
            @RequestBody RegisterTransportProviderCommand command) {
        RegisterTransportProviderResponse response = registerTransportProviderUsecase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("TransportProvider registered successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<TransportProviderResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        ListTransportProvidersQuery query = new ListTransportProvidersQuery(page, size, sortBy, sortDirection);
        PaginatedResponse<TransportProviderResponse> response = listTransportProviderUsecase.execute(query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TRANSPORT_PROVIDER')")
    public ResponseEntity<ApiResponse<TransportProviderResponse>> getMyProfile(
            @AuthenticationPrincipal DomainUserDetails userDetails) {
        TransportProviderResponse response = getMyTransportProviderProfileUsecase.execute(
                new GetMyTransportProviderProfileQuery(userDetails.getUser().getId()));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('TRANSPORT_PROVIDER')")
    public ResponseEntity<ApiResponse<TransportProviderResponse>> updateMyProfile(
            @AuthenticationPrincipal DomainUserDetails userDetails,
            @RequestBody UpdateMyTransportProviderRequest request) {
        ModifyMyTransportProviderInformationCommand command = new ModifyMyTransportProviderInformationCommand(
                userDetails.getUser().getId(),
                request.addressDetails(),
                request.contactInformation());

        TransportProviderResponse response = modifyMyTransportProviderInformationUsecase.execute(command);
        return ResponseEntity.ok(ApiResponse.success("Transport provider information updated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TransportProviderResponse>> getProfile(@PathVariable UUID id) {
        TransportProviderResponse response = viewTransportProviderProfileUsecase
                .execute(new ViewTransportProviderProfileQuery(id));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TransportProviderResponse>> update(
            @PathVariable UUID id,
            @RequestBody ModifyTransportProviderInformationCommand command) {
        // Ensure the ID from path matches the command
        ModifyTransportProviderInformationCommand commandWithId = new ModifyTransportProviderInformationCommand(
                id,
                command.addressDetails(),
                command.contactInformation());

        TransportProviderResponse response = modifyTransportProviderInformationUsecase.execute(commandWithId);
        return ResponseEntity.ok(ApiResponse.success("Transport provider updated successfully", response));
    }
}
