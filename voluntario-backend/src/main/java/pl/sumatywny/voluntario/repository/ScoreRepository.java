package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.user.Score;

import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
//    @Query("""
//            SELECT s FROM pl.sumatywny.voluntario.model.user.Score s
//            JOIN FETCH s.user u
//            JOIN FETCH u.participations p
//            GROUP BY s.totalPoints, s.overallRating, s
//            ORDER BY s.totalPoints DESC, s.overallRating DESC, COUNT(p) DESC
//            """)
    @Query("""
            SELECT s
            FROM pl.sumatywny.voluntario.model.user.Score s
            JOIN s.user u
            JOIN UserParticipation up ON u.id = up.user.id
            GROUP BY s.totalPoints, s.overallRating, s
            ORDER BY s.totalPoints DESC, s.overallRating DESC, COUNT(up) DESC
            """)
    Page<Score> findAll(Pageable pageable);

    Optional<Score> findByUserId(Long userId);
}
