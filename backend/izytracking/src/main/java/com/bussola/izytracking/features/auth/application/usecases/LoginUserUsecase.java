package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.api.dto.ApiResponse;
import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.application.dto.LoginResponse;
import com.bussola.izytracking.features.auth.domain.User;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.commands.LoginUserCommand;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;

@Service
public class LoginUserUsecase {

    private final UserRepository userRepository;
    private final AuthenticateUserUsecase authenticateUserUsecase;
    private final JwtService jwtService;

    @Value("${jwt.access-cookie-name:access_token}")
    private String accessCookieName;

    @Value("${jwt.refresh-cookie-name:refresh_token}")
    private String refreshCookieName;

    @Value("${jwt.access-token-expiration:3600000}")
    private long accessTokenExpirationMillis;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpirationMillis;

    public LoginUserUsecase(UserRepository userRepository, AuthenticateUserUsecase authenticateUserUsecase,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.authenticateUserUsecase = authenticateUserUsecase;
        this.jwtService = jwtService;
    }

    public ApiResponse<LoginResponse> execute(LoginUserCommand command, HttpServletResponse response) {
        String email = command.email();
        String password = command.password();

        Authentication authentication = authenticateUserUsecase.execute(email, password, response);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        LoginResponse loginResponse = new LoginResponse(
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name());

        // Generar tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Setear access token cookie
        Cookie accessCookie = new Cookie(accessCookieName, accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge((int) (accessTokenExpirationMillis / 1000));
        accessCookie.setAttribute("SameSite", "Strict");
        response.addCookie(accessCookie);

        // Setear refresh token cookie
        Cookie refreshCookie = new Cookie(refreshCookieName, refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) (refreshTokenExpirationMillis / 1000));
        refreshCookie.setAttribute("SameSite", "Strict");
        response.addCookie(refreshCookie);

        return ApiResponse.success("User logged in successfully", loginResponse);
    }
}
