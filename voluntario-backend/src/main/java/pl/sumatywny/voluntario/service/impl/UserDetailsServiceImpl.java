package pl.sumatywny.voluntario.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.model.user.CustomUserDetails;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading user by username: " + username);
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            logger.error("User Not Found with username: " + username);
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        return new CustomUserDetails(user.get());
    }
}
