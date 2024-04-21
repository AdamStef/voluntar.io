package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sumatywny.voluntario.model.user.Token;
import pl.sumatywny.voluntario.model.user.User;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
//    Optional<Token> findByUser(User user);
//    void deleteByUser(User user);
}
