package com.bussola.izytracking.features.auth.application.usecases;

import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetUsernameByUserIdQuery;

public class GetUsernameByUserIdUsecase {
    private final UserRepository userRepository;

    public GetUsernameByUserIdUsecase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String execute(GetUsernameByUserIdQuery query) {
        return userRepository.findById(query.userId())
                .map(user -> user.getDisplayName())
                .orElse(null);
    }
}
