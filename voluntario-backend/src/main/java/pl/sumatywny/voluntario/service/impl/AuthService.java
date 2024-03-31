package pl.sumatywny.voluntario.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.RegisterDTO;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Value(value = "${custom.max.session}")
    private int maxSession;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final SessionRegistry sessionRegistry;
    private final RedisIndexedSessionRepository redisIndexedSessionRepository;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AuthenticationManager authManager, SessionRegistry sessionRegistry, RedisIndexedSessionRepository redisIndexedSessionRepository, SecurityContextRepository securityContextRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.sessionRegistry = sessionRegistry;
        this.redisIndexedSessionRepository = redisIndexedSessionRepository;
        this.securityContextRepository = securityContextRepository;
        this.securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
    }

    public String register(RegisterDTO registerDTO) {
        String email = registerDTO.getEmail(); // TODO: .trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException(String.format("User with email %s already exists.", email));
        }

        Set<Role> rolesReq;
        try {
            rolesReq = registerDTO.getRoles().stream()
                .map(role -> Role.valueOf("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toSet());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role name.");
        }

        Set<UserRole> roles = rolesReq.stream().map(role -> roleRepository.findByRole(role)
            .orElseThrow(() -> new IllegalStateException("Role not found.")))
            .collect(Collectors.toSet());

//        Role roleEnum = Role.valueOf("ROLE_" + registerDTO.getRole().toUpperCase());

//        UserRole role = roleRepository.findByRole(roleEnum)
//                .orElseThrow(() -> new IllegalStateException("Role not found."));
//
//        Set<UserRole> roles = new HashSet<>();
//        roles.add(role);

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .roles(roles)
                .build();

        userRepository.save(user);
        return "User registered.";
    }

    public String login(AuthRequestDTO authRequestDTO, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(authRequestDTO.getEmail(), authRequestDTO.getPassword())
        );

        validateMaxSession(authentication);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);

        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return "User logged in.";
    }

    private void validateMaxSession(Authentication authentication) {
        if (maxSession <= 0) {
            return;
        }

        var user = (UserDetails) authentication.getPrincipal();
        List<SessionInformation> session = sessionRegistry.getAllSessions(user, false);
        if (session.size() >= maxSession) {
            sessionRegistry.getAllSessions(user, true).forEach(SessionInformation::expireNow);
            session.stream()
                    .min(Comparator.comparing(SessionInformation::getLastRequest))
                    .ifPresent(sessionInformation -> redisIndexedSessionRepository.deleteById(sessionInformation.getSessionId()));
        }
    }
}