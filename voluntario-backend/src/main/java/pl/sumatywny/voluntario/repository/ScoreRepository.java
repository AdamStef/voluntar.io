package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.user.Score;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
//    Page<Score> findAll(Pageable pageable);
}
