package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Location;

import java.util.List;
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Location findFirstById(Long id);
    List<Location> findAll();
}
