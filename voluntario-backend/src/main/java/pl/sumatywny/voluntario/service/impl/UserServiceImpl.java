package pl.sumatywny.voluntario.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.user.UserRequestDTO;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(UserRequestDTO userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        Set<UserRole> roles = new HashSet<>();
        for (Role role : userRequest.getRoles()) {
            roles.add(roleRepository.findByRole(role).orElseThrow(() -> new IllegalArgumentException("Error: Role is not found.")));
        }
//        roles.add(roleRepository.findByRole(Role.ROLE_ADMIN)
//                .orElseThrow(() -> new IllegalArgumentException("Role is not found.")));

        User user = User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .roles(roles)
                .build();

        userRepository.save(user);
    }
}
