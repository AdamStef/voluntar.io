package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.sumatywny.voluntario.model.user.Token;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);

    @Query("SELECT t FROM Token t WHERE t.user.id = :userId AND t.revoked = false AND t.expired = false")
    List<Token> findAllValidTokensByUser(Long userId);
//    Optional<Token> findByUser(User user);
//    void deleteByUser(User user);
}
