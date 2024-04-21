package pl.sumatywny.voluntario.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
import pl.sumatywny.voluntario.dtos.auth.JwtResponseDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Token;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.security.JwtService;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    @Value(value = "${custom.max.session}")
    private int maxSession;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

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

//        UserRole role = roleRepository.findByRoleName("ROLE_" + registerDTO.role().toUpperCase())
//                .orElseThrow(() -> new IllegalArgumentException("Role not found."));

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(registerDTO.password()))
                .role(role)
                .firstName(registerDTO.firstName())
                .lastName(registerDTO.lastName())
                .phoneNumber(registerDTO.phoneNumber())
                .isDeleted(false)
                .isBanned(false)
                .isVerified(false)
                .build();

        return userRepository.save(user);
    }

    public JwtResponseDTO login(AuthRequestDTO authRequestDTO) {
        Authentication authentication = authManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        authRequestDTO.getEmail(),
                        authRequestDTO.getPassword())
        );

        var claims = new HashMap<String, Object>();
        var user = ((UserDetails) authentication.getPrincipal());
        var jwtToken = jwtService.generateToken(claims, user);
        return JwtResponseDTO.builder().accessToken(jwtToken).build();
//        validateMaxSession(authentication);

//        SecurityContext context = SecurityContextHolder.createEmptyContext();
//        context.setAuthentication(authentication);
//
//        securityContextHolderStrategy.setContext(context);
//        securityContextRepository.saveContext(context, request, response);
//
//        return context.getAuthentication();
    }

}
