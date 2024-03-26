package pl.sumatywny.voluntario.service;

import pl.sumatywny.voluntario.dtos.user.UserRequestDTO;

public interface UserService {
    void register(UserRequestDTO userRequest);
}
