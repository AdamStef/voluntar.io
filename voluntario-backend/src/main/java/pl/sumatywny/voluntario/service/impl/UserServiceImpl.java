package pl.sumatywny.voluntario.service.impl;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserParticipationRepository userParticipationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserParticipationRepository userParticipationRepository) {
        this.userRepository = userRepository;
        this.userParticipationRepository = userParticipationRepository;
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

    public void changePassword(User user, String newPassword) {
//        user.setPassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void changeData(User user, String firstName, String lastName, String email, String phoneNumber) {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        userRepository.save(user);
    }

    public List<String> getUserComments(Long userId) {
        List<UserParticipation> participations = userParticipationRepository.findByUserId(userId);
        return participations.stream()
                .map(UserParticipation::getComment)
                .filter(comment -> comment != null && !comment.isEmpty())   // bez tego mi nie działało
                .collect(Collectors.toList());
    }
}
