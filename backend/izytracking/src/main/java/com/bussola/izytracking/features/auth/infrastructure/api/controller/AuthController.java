package com.bussola.izytracking.features.auth.infrastructure.api.controller;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.features.auth.application.dto.LoginResponse;
import com.bussola.izytracking.features.auth.application.dto.RefreshSessionResult;
import com.bussola.izytracking.features.auth.application.dto.UserResponse;
import com.bussola.izytracking.features.auth.application.usecases.LoginUserUsecase;
import com.bussola.izytracking.features.auth.application.usecases.RefreshSessionUsecase;
import com.bussola.izytracking.features.auth.application.usecases.GetCurrentSessionUsecase;
import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.usecases.commands.LoginUserCommand;
import com.bussola.izytracking.features.auth.domain.usecases.commands.RefreshSessionCommand;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetCurrentSessionQuery;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUserUsecase loginUserUsecase;
    private final GetCurrentSessionUsecase getCurrentSessionUsecase;
    private final RefreshSessionUsecase refreshSessionUsecase;

    @Value("${jwt.access-token-expiration:3600000}")
    private long accessTokenExpirationMillis;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpirationMillis;

    @Value("${jwt.cookie-name:access_token}")
    private String cookieName;

    public AuthController(
            LoginUserUsecase loginUserUsecase,
            GetCurrentSessionUsecase getCurrentSessionUsecase,
            RefreshSessionUsecase refreshSessionUsecase,
            @Value("${jwt.cookie-name:access_token}") String cookieName) {
        this.loginUserUsecase = loginUserUsecase;
        this.getCurrentSessionUsecase = getCurrentSessionUsecase;
        this.refreshSessionUsecase = refreshSessionUsecase;
        this.cookieName = cookieName;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginUserCommand command,
            HttpServletResponse response) {
        LoginResponse loginResponse = loginUserUsecase.execute(command);

        setCookie(response, "access_token", loginResponse.accessToken(), accessTokenExpirationMillis);
        setCookie(response, "refresh_token", loginResponse.refreshToken(), refreshTokenExpirationMillis);

        return ResponseEntity.ok(ApiResponse.success(loginResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        // Limpiar ambas cookies (access y refresh)
        clearCookie(response, "access_token");
        clearCookie(response, "refresh_token");
        return ResponseEntity.ok(ApiResponse.success("Logout exitoso"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(HttpServletRequest request,
            @CookieValue(name = "access_token", required = false) String accessToken) {
        if (accessToken == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("No autenticado"));
        }
        User user = getCurrentSessionUsecase.execute(new GetCurrentSessionQuery(accessToken));

        return ResponseEntity.ok(ApiResponse.success(new UserResponse(user.getEmail(), user.getDisplayName(),
                user.getRole().name(), user.getStatus().name(), user.getId().toString())));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        Optional<RefreshSessionResult> result = refreshSessionUsecase.execute(new RefreshSessionCommand(refreshToken));

        if (result.isEmpty()) {
            clearCookie(response, "access_token");
            clearCookie(response, "refresh_token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        setCookie(response, "access_token", result.get().accessToken(), accessTokenExpirationMillis);
        setCookie(response, "refresh_token", result.get().refreshToken(), refreshTokenExpirationMillis);

        return ResponseEntity.noContent().build();
    }

    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new jakarta.servlet.http.Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    private void setCookie(HttpServletResponse response, String name, String value, long maxAgeMillis) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (maxAgeMillis / 1000));
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }
}
