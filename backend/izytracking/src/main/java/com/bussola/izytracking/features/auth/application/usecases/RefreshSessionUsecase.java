package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.domain.User;
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
    public void execute(RefreshSessionCommand command, HttpServletResponse response) {
        String refreshToken = command.refreshToken();
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            // Token inválido o expirado: limpiar cookies
            clearCookie(response, accessCookieName);
            clearCookie(response, refreshCookieName);
            return;
        }

        // Extraer usuario del refresh token
        User user = userRepository.findById(jwtService.extractUserId(refreshToken))
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        // Rotar refresh token (opcional, pero recomendado)
        String newRefreshToken = jwtService.generateRefreshToken(user);
        String newAccessToken = jwtService.generateAccessToken(user);

        // Setear cookies
        setCookie(response, accessCookieName, newAccessToken, accessTokenExpirationMillis);
        setCookie(response, refreshCookieName, newRefreshToken, refreshTokenExpirationMillis);
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

    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }
}
