package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.application.dto.LoginResponse;
import com.bussola.izytracking.features.auth.domain.entities.DomainUserDetails;
import com.bussola.izytracking.features.auth.domain.entities.User;
import com.bussola.izytracking.features.auth.domain.usecases.commands.LoginUserCommand;

@Service
public class LoginUserUsecase {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginUserUsecase(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponse execute(LoginUserCommand command) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(command.email(), command.password()));

        DomainUserDetails principal = (DomainUserDetails) auth.getPrincipal();
        User user = principal.getUser();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResponse(
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                accessToken,
                refreshToken);
    }
}
