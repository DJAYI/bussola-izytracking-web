package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.auth.domain.exceptions.InvalidCredentialsException;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthenticateUserUsecase {
    private final GetUserByEmailUsecase getUserByEmailUsecase;
    private final VerifyUserPasswordUsecase verifyUserPasswordUsecase;
    private final LogoutUserUsecase logoutUserUsecase;

    public AuthenticateUserUsecase(
            GetUserByEmailUsecase getUserByEmailUsecase,
            VerifyUserPasswordUsecase verifyUserPasswordUsecase,
            LogoutUserUsecase logoutUserUsecase) {
        this.getUserByEmailUsecase = getUserByEmailUsecase;
        this.verifyUserPasswordUsecase = verifyUserPasswordUsecase;
        this.logoutUserUsecase = logoutUserUsecase;
    }

    public Authentication execute(String email, String password, HttpServletResponse response) {
        UserDetails userDetails = getUserByEmailUsecase.execute(email);

        if (!verifyUserPasswordUsecase.verify(password, userDetails.getPassword())) {
            logoutUserUsecase.execute(response);
            throw new InvalidCredentialsException();
        }

        return new UsernamePasswordAuthenticationToken(email, password, userDetails.getAuthorities());
    }
}
