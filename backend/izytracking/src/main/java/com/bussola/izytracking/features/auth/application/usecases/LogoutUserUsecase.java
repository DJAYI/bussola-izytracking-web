package com.bussola.izytracking.features.auth.application.usecases;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LogoutUserUsecase {

    @Value("${jwt.access-cookie-name:access_token}")
    private String accessCookieName;

    @Value("${jwt.refresh-cookie-name:refresh_token}")
    private String refreshCookieName;

    public void execute(HttpServletResponse response) {
        clearCookie(response, accessCookieName);
        clearCookie(response, refreshCookieName);
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
