package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.dtos.user.ScoreDTO;
import pl.sumatywny.voluntario.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            SELECT
             new pl.sumatywny.voluntario.dtos.user.ScoreDTO(
             u.id, concat(u.firstName, ' ', u.lastName) , u.score.points, u.score.rating, size(u.participations))
             FROM User u
             INNER JOIN u.role r
             WHERE r.role = 'ROLE_VOLUNTEER'
             ORDER BY u.score.points DESC, u.score.rating DESC, size(u.participations) DESC
             LIMIT :limit
             """)
    List<ScoreDTO> findTopScores(int limit);
}
