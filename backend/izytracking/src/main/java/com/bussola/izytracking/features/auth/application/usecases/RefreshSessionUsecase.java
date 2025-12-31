package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.domain.User;
import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.commands.RefreshSessionCommand;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
// import lombok.Value; // Eliminado, no se usa aquí

@Service
public class RefreshSessionUsecase {
    private final LogoutUserUsecase logoutUserUsecase;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @org.springframework.beans.factory.annotation.Value("${jwt.cookie-name}")
    private String cookieName;

    @org.springframework.beans.factory.annotation.Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpirationMillis;

    @org.springframework.beans.factory.annotation.Value("${jwt.access-token-expiration}")
    private long accessTokenExpirationMillis;

    public RefreshSessionUsecase(LogoutUserUsecase logoutUserUsecase, JwtService jwtService,
            UserRepository userRepository) {
        this.logoutUserUsecase = logoutUserUsecase;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public void execute(RefreshSessionCommand command, HttpServletResponse response) {
        // Invalida la sesión actual
        logoutUserUsecase.execute(response);

        // Aquí podrías agregar lógica adicional para crear una nueva sesión
        // utilizando el refreshToken proporcionado en el comando.

        boolean isAccessExpired = jwtService.isTokenExpired(command.refreshToken());

        if (!isAccessExpired) {
            // Lógica para manejar el caso cuando el token de acceso aún es válido
            // Podrías simplemente devolver el mismo token o realizar alguna otra acción.

            Cookie cookie = new Cookie(cookieName, command.refreshToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");

            // Convertir milisegundos a segundos para setMaxAge
            cookie.setMaxAge((int) (accessTokenExpirationMillis / 1000));

            response.addCookie(cookie);
        }

        User user = userRepository.findById(jwtService.extractUserId(command.refreshToken()))
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        String refreshToken = jwtService.generateRefreshToken(user);

        Cookie cookie = new Cookie(cookieName, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");

        cookie.setMaxAge((int) (refreshTokenExpirationMillis / 1000));

        response.addCookie(cookie);
    }
}
