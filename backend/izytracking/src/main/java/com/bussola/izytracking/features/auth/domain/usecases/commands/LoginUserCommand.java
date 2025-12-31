package com.bussola.izytracking.features.auth.domain.usecases.commands;

public record LoginUserCommand(
                String email,
                String password,
                Boolean rememberMe) {

}
