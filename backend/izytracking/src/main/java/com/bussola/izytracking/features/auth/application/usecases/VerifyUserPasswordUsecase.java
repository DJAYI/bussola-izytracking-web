package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class VerifyUserPasswordUsecase {
    private PasswordEncoder passwordEncoder;

    public VerifyUserPasswordUsecase(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public boolean verify(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
