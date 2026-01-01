package com.bussola.izytracking.features.auth.application.usecases;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.application.dto.RefreshSessionResult;
import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.commands.RefreshSessionCommand;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class RefreshSessionUsecase {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${jwt.access-cookie-name:access_token}")
    private String accessCookieName;

    @Value("${jwt.refresh-cookie-name:refresh_token}")
    private String refreshCookieName;

    @Value("${jwt.access-token-expiration:3600000}")
    private long accessTokenExpirationMillis;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpirationMillis;

    public RefreshSessionUsecase(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    /**
     * Refresca la sesión usando el refresh token. Si el refresh token es válido y
     * no ha expirado,
     * genera un nuevo access token y un nuevo refresh token (rotación), y los setea
     * en cookies.
     * Si el refresh token es inválido o expirado, limpia ambas cookies.
     */
    public Optional<RefreshSessionResult> execute(RefreshSessionCommand command) {

        String refreshToken = command.refreshToken();

        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return Optional.empty();
        }

        User user = userRepository.findById(jwtService.extractUserId(refreshToken))
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        return Optional.of(
                new RefreshSessionResult(
                        jwtService.generateAccessToken(user),
                        jwtService.generateRefreshToken(user)));
    }
}
