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

    @Value("${jwt.cookie-name}")
    private String cookieName;

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

        // Aquí podrías agregar la lógica para generar y establecer el token JWT en una
        // cookie si es necesario

        long defaultExpiration = 60 * 60 * 1000L; // 1 hour default

        Cookie cookie = new Cookie(cookieName, jwtService.generateAccessToken(user));
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (defaultExpiration / 1000)); // Convert milliseconds to seconds
        response.addCookie(cookie);

        cookie.setAttribute("SameSite", "Lax"); // O "Lax" si estás sin HTTPS
        response.addCookie(cookie);

        return ApiResponse.success("User logged in successfully", loginResponse);
    }
}
