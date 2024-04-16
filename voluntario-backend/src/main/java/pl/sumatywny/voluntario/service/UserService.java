package pl.sumatywny.voluntario.service;

import pl.sumatywny.voluntario.model.user.User;

public interface UserService {
    User getUserByEmail(String email);
}
