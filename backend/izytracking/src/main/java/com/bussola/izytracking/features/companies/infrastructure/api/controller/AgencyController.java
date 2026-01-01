package com.bussola.izytracking.features.companies.infrastructure.api.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.features.companies.application.dto.AgencyResponse;
import com.bussola.izytracking.features.companies.application.dto.PaginatedResponse;
import com.bussola.izytracking.features.companies.application.dto.RegisterAgencyResponse;
import com.bussola.izytracking.features.companies.application.usecases.ListAgenciesUsecase;
import com.bussola.izytracking.features.companies.application.usecases.ModifyAgencyInformationUsecase;
import com.bussola.izytracking.features.companies.application.usecases.RegisterAgencyUsecase;
import com.bussola.izytracking.features.companies.application.usecases.ViewAgencyProfileUsecase;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.ModifyAgencyInformationCommand;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.commands.RegisterAgencyCommand;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ListAgenciesQuery;
import com.bussola.izytracking.features.companies.domain.usecases.agencies.queries.ViewAgencyProfileQuery;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/agencies")
public class AgencyController {

    private final RegisterAgencyUsecase registerAgencyUsecase;
    private final ViewAgencyProfileUsecase viewAgencyProfileUsecase;
    private final ModifyAgencyInformationUsecase modifyAgencyInformationUsecase;
    private final ListAgenciesUsecase listAgenciesUsecase;

    public AgencyController(
            RegisterAgencyUsecase registerAgencyUsecase,
            ViewAgencyProfileUsecase viewAgencyProfileUsecase,
            ModifyAgencyInformationUsecase modifyAgencyInformationUsecase,
            ListAgenciesUsecase listAgenciesUsecase) {
        this.registerAgencyUsecase = registerAgencyUsecase;
        this.viewAgencyProfileUsecase = viewAgencyProfileUsecase;
        this.modifyAgencyInformationUsecase = modifyAgencyInformationUsecase;
        this.listAgenciesUsecase = listAgenciesUsecase;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegisterAgencyResponse>> register(
            @RequestBody RegisterAgencyCommand command) {
        RegisterAgencyResponse response = registerAgencyUsecase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Agency registered successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<AgencyResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        ListAgenciesQuery query = new ListAgenciesQuery(page, size, sortBy, sortDirection);
        PaginatedResponse<AgencyResponse> response = listAgenciesUsecase.execute(query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AgencyResponse>> getProfile(@PathVariable UUID id) {
        AgencyResponse response = viewAgencyProfileUsecase.execute(new ViewAgencyProfileQuery(id));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
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
