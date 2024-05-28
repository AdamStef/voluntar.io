package pl.sumatywny.voluntario.service.impl;
import org.hibernate.Hibernate;
import java.util.List;
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

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
//        for (User user : users) {
//            Hibernate.initialize(user.getParticipations());
//        }
        return users;
    }
}
