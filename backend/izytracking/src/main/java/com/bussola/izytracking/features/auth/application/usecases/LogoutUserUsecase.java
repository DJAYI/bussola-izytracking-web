package com.bussola.izytracking.features.auth.application.usecases;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

@Service
public class LogoutUserUsecase {

    @Value("${jwt.cookie-name}")
    private String cookieName;

    public void execute(HttpServletResponse response) {
        jakarta.servlet.http.Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira inmediatamente
        response.addCookie(cookie);
    }
}
