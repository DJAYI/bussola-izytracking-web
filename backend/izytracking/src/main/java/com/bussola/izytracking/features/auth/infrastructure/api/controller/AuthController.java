package com.bussola.izytracking.features.auth.infrastructure.api.controller;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.features.auth.application.dto.LoginResponse;
import com.bussola.izytracking.features.auth.application.usecases.LoginUserUsecase;
import com.bussola.izytracking.features.auth.application.usecases.LogoutUserUsecase;
import com.bussola.izytracking.features.auth.application.usecases.RefreshSessionUsecase;
import com.bussola.izytracking.features.auth.application.usecases.GetCurrentSessionUsecase;
import com.bussola.izytracking.features.auth.domain.usecases.commands.LoginUserCommand;
import com.bussola.izytracking.features.auth.domain.usecases.commands.RefreshSessionCommand;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetCurrentSessionQuery;
import com.bussola.izytracking.features.auth.domain.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUserUsecase loginUserUsecase;
    private final LogoutUserUsecase logoutUserUsecase;
    private final GetCurrentSessionUsecase getCurrentSessionUsecase;
    private final RefreshSessionUsecase refreshSessionUsecase;

    @Value("${jwt.cookie-name:access_token}")
    private String cookieName;

    public AuthController(
            LoginUserUsecase loginUserUsecase,
            LogoutUserUsecase logoutUserUsecase,
            GetCurrentSessionUsecase getCurrentSessionUsecase,
            RefreshSessionUsecase refreshSessionUsecase,
            @Value("${jwt.cookie-name:access_token}") String cookieName) {
        this.loginUserUsecase = loginUserUsecase;
        this.logoutUserUsecase = logoutUserUsecase;
        this.getCurrentSessionUsecase = getCurrentSessionUsecase;
        this.refreshSessionUsecase = refreshSessionUsecase;
        this.cookieName = cookieName;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginUserCommand command,
            HttpServletResponse response) {
        ApiResponse<LoginResponse> apiResponse = loginUserUsecase.execute(command, response);

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        logoutUserUsecase.execute(response);
        return ResponseEntity.ok(ApiResponse.success("Logout exitoso"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> me(HttpServletRequest request,
            @CookieValue(name = "access_token", required = false) String accessToken) {
        if (accessToken == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("No autenticado"));
        }
        User user = getCurrentSessionUsecase.execute(new GetCurrentSessionQuery(accessToken));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refreshSession(
            @CookieValue(name = "access_token", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("No autenticado"));
        }

        refreshSessionUsecase.execute(new RefreshSessionCommand(refreshToken), response);

        return ResponseEntity.ok(ApiResponse.success("Sesión refrescada exitosamente"));
    }
}
