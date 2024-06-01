package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import pl.sumatywny.voluntario.dtos.user.ScoreDTO;
import pl.sumatywny.voluntario.model.user.UserParticipation;

import java.util.List;
import java.util.Optional;

public interface UserParticipationRepository extends JpaRepository<UserParticipation, Long> {
//    @Query("""
//            SELECT new pl.sumatywny.voluntario.dtos.user.ScoreDTO(
//                CONCAT(u.firstName, ' ', u.lastName),
//                s.points,
//                s.rating,
//                COUNT(p)
//            )
//            FROM UserParticipation p
//            JOIN p.user u
//            JOIN u.score s
//            WHERE p.event.isCompleted = true
//            GROUP BY u.id
//            ORDER BY s.points DESC
//            """)
//    List<ScoreDTO> findTopScores(int limit);
//    List<UserParticipation> findByUserId(Long userId);
    Optional<UserParticipation> findByUserIdAndEventId(Long userId, Long eventId);

    @EntityGraph(attributePaths = {"user"})
    List<UserParticipation> findByEventId(Long eventId);
    List<UserParticipation> findByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM UserParticipation p WHERE p.user.id = :userId")
    int countByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM UserParticipation p WHERE p.event.id = :eventId AND p.user.id = :userId")
    void deleteByEventIdAndUserId(Long eventId, Long userId);
}
