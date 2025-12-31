package com.bussola.izytracking.features.auth.application.usecases;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.config.security.JwtService;
import com.bussola.izytracking.features.auth.domain.User;
import com.bussola.izytracking.features.auth.domain.exceptions.InvalidTokenException;
import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetCurrentSessionQuery;

@Service
public class GetCurrentSessionUsecase {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GetCurrentSessionUsecase(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User execute(GetCurrentSessionQuery query) {
        String accessToken = query.accessToken();

        if (accessToken == null || accessToken.isBlank()) {
            throw new InvalidTokenException("Access token is required");
        }

        if (!jwtService.isTokenValid(accessToken)) {
            throw new InvalidTokenException();
        }

        UUID userId = jwtService.extractUserId(accessToken);

        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(jwtService.extractEmail(accessToken)));
    }
}
