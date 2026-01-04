package com.bussola.izytracking.features.auth.application.usecases;

import org.springframework.stereotype.Service;

import com.bussola.izytracking.features.auth.domain.repository.UserRepository;
import com.bussola.izytracking.features.auth.domain.usecases.queries.GetUsernameByUserIdQuery;

@Service
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
