package pl.sumatywny.voluntario.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.user.userdetails.CustomUserDetails;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            logger.error("User Not Found with username: {}", email);
            throw new UsernameNotFoundException("User Not Found with email: " + email);
        }
        return new CustomUserDetails(user.get());
    }
}
