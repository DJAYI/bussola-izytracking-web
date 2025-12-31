package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.auth.domain.exceptions.UserNotFoundException;
import com.bussola.izytracking.features.auth.domain.repository.UserRepository;

@Service
public class GetUserByEmailUsecase {
    private final UserRepository userRepository;

    public GetUserByEmailUsecase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails execute(String email) {
        return userRepository.findByEmail(email)
                .map(user -> User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .accountExpired(false)
                        .accountLocked(false)
                        .credentialsExpired(false)
                        .disabled(false)
                        .build())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

    }
}
