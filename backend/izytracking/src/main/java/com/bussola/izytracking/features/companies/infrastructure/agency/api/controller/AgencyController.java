package com.bussola.izytracking.features.companies.infrastructure.agency.api.controller;

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
import com.bussola.izytracking.features.companies.application.agency.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.application.agency.dto.RegisterAgencyResponse;
import com.bussola.izytracking.features.companies.application.agency.dto.UpdateMyAgencyRequest;
import com.bussola.izytracking.features.companies.application.agency.usecases.GetMyAgencyProfileUsecase;
import com.bussola.izytracking.features.companies.application.agency.usecases.ListAgenciesUsecase;
import com.bussola.izytracking.features.companies.application.agency.usecases.ModifyAgencyInformationUsecase;
import com.bussola.izytracking.features.companies.application.agency.usecases.ModifyMyAgencyInformationUsecase;
import com.bussola.izytracking.features.companies.application.agency.usecases.RegisterAgencyUsecase;
import com.bussola.izytracking.features.companies.application.agency.usecases.ViewAgencyProfileUsecase;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.ModifyAgencyInformationCommand;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.ModifyMyAgencyInformationCommand;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.RegisterAgencyCommand;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.GetMyAgencyProfileQuery;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ListAgenciesQuery;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ViewAgencyProfileQuery;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/agencies")
public class AgencyController {

    private final RegisterAgencyUsecase registerAgencyUsecase;
    private final ViewAgencyProfileUsecase viewAgencyProfileUsecase;
    private final ModifyAgencyInformationUsecase modifyAgencyInformationUsecase;
    private final ModifyMyAgencyInformationUsecase modifyMyAgencyInformationUsecase;
    private final ListAgenciesUsecase listAgenciesUsecase;
    private final GetMyAgencyProfileUsecase getMyAgencyProfileUsecase;

    public AgencyController(
            RegisterAgencyUsecase registerAgencyUsecase,
            ViewAgencyProfileUsecase viewAgencyProfileUsecase,
            ModifyAgencyInformationUsecase modifyAgencyInformationUsecase,
            ModifyMyAgencyInformationUsecase modifyMyAgencyInformationUsecase,
            ListAgenciesUsecase listAgenciesUsecase,
            GetMyAgencyProfileUsecase getMyAgencyProfileUsecase) {
        this.registerAgencyUsecase = registerAgencyUsecase;
        this.viewAgencyProfileUsecase = viewAgencyProfileUsecase;
        this.modifyAgencyInformationUsecase = modifyAgencyInformationUsecase;
        this.modifyMyAgencyInformationUsecase = modifyMyAgencyInformationUsecase;
        this.listAgenciesUsecase = listAgenciesUsecase;
        this.getMyAgencyProfileUsecase = getMyAgencyProfileUsecase;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegisterAgencyResponse>> register(
            @RequestBody RegisterAgencyCommand command) {
        RegisterAgencyResponse response = registerAgencyUsecase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Agency registered successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<AgencyResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        ListAgenciesQuery query = new ListAgenciesQuery(page, size, sortBy, sortDirection);
        PaginatedResponse<AgencyResponse> response = listAgenciesUsecase.execute(query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('AGENCY')")
    public ResponseEntity<ApiResponse<AgencyResponse>> getMyProfile(
            @AuthenticationPrincipal DomainUserDetails userDetails) {
        AgencyResponse response = getMyAgencyProfileUsecase.execute(
                new GetMyAgencyProfileQuery(userDetails.getUser().getId()));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('AGENCY')")
    public ResponseEntity<ApiResponse<AgencyResponse>> updateMyProfile(
            @AuthenticationPrincipal DomainUserDetails userDetails,
            @RequestBody UpdateMyAgencyRequest request) {
        ModifyMyAgencyInformationCommand command = new ModifyMyAgencyInformationCommand(
                userDetails.getUser().getId(),
                request.addressDetails(),
                request.contactInformation());

        AgencyResponse response = modifyMyAgencyInformationUsecase.execute(command);
        return ResponseEntity.ok(ApiResponse.success("Agency information updated successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AgencyResponse>> getProfile(@PathVariable UUID id) {
        AgencyResponse response = viewAgencyProfileUsecase.execute(new ViewAgencyProfileQuery(id));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AgencyResponse>> update(
            @PathVariable UUID id,
            @RequestBody ModifyAgencyInformationCommand command) {
        // Ensure the ID from path matches the command
        ModifyAgencyInformationCommand commandWithId = new ModifyAgencyInformationCommand(
                id,
                command.addressDetails(),
                command.contactInformation());

        AgencyResponse response = modifyAgencyInformationUsecase.execute(commandWithId);
        return ResponseEntity.ok(ApiResponse.success("Agency updated successfully", response));
    }
}
