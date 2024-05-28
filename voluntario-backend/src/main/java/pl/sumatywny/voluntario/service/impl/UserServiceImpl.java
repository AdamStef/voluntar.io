package pl.sumatywny.voluntario.service.impl;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email %s not found".formatted(email)));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User with id %d not found".formatted(id)));
    }

    // Function to change the password of a user
    public void changePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public User changeData(User user, String firstName, String lastName, String email, String phoneNumber) {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        return userRepository.save(user);
    }

}
