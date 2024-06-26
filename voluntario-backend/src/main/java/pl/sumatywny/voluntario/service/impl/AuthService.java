package pl.sumatywny.voluntario.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.bind.annotation.ResponseStatus;

import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.dtos.user.RegisterDTO;
import pl.sumatywny.voluntario.dtos.auth.AuthRequestDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthService {
    @Value(value = "${app.security.max-sessions}")
    private int maxSession;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final SessionRegistry sessionRegistry;
    private final RedisIndexedSessionRepository redisIndexedSessionRepository;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();

    public User register(RegisterDTO registerDTO) {
        String email = registerDTO.email().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException(String.format("User with email %s already exists.", email));
        }

        Role roleEnum;

        try {
            roleEnum = Role.valueOf("ROLE_" + registerDTO.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role not found.");
        }

        UserRole role = roleRepository.findByRole(roleEnum)
                .orElseThrow(() -> new IllegalArgumentException("Role not found."));

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(registerDTO.password()))
                .role(role)
                .firstName(registerDTO.firstName())
                .lastName(registerDTO.lastName())
                .phoneNumber(registerDTO.phoneNumber())
                .gender(registerDTO.gender())
                .isDeleted(false)
                .isBanned(false)
                .isVerified(false)
                .build();

        return userRepository.save(user);
    }

    public Authentication login(
            AuthRequestDTO authRequestDTO,
            HttpServletRequest request,
            HttpServletResponse response) {
        Authentication authentication = authManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(authRequestDTO.getEmail(), authRequestDTO.getPassword())
        );

        validateMaxSession(authentication);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);

        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return context.getAuthentication();
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

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public User getUserFromSession() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("User not authenticated.");
        }

        var user = userRepository.findByEmail(authentication.getName());
        if (user.isEmpty()) {
            throw new IllegalStateException("User not found.");
        }

        return user.get();
    }
    public OrganizationResponseDTO getOrganizationFromSession() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("User not authenticated.");
        }

        var user = userRepository.findByEmail(authentication.getName());
        if (user.isEmpty()) {
            throw new IllegalStateException("User not found.");
        }

        return new OrganizationResponseDTO(user.get().getOrganization());
    }
}
