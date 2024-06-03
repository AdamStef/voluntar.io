package pl.sumatywny.voluntario.service;

import pl.sumatywny.voluntario.model.user.User;

public interface UserService {
    User getUserByEmail(String email);
    User getUserById(Long id);
    void changePassword(User user, String newPassword);
    void changeData(User user, String firstName, String lastName, String email, String phoneNumber);
}
