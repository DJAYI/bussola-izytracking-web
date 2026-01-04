package com.bussola.izytracking.features.auth.infrastructure.api.controller;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.features.auth.application.usecases.GetUsernameByUserIdUsecase;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetUsernameByUserIdQuery;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/users")
public class UserController {

    private final GetUsernameByUserIdUsecase getUsernameByUserIdUsecase;

    public UserController(GetUsernameByUserIdUsecase getUsernameByUserIdUsecase) {
        this.getUsernameByUserIdUsecase = getUsernameByUserIdUsecase;
    }

    @GetMapping("/{id}/username")
    public ApiResponse<String> getUsernameByUserId(@PathVariable("id") UUID userId) {
        // Implementation to get username by user ID
        return ApiResponse.success("Username retrieved successfully", getUsernameByUserIdUsecase.execute(
                new GetUsernameByUserIdQuery(userId)));
    }

}
