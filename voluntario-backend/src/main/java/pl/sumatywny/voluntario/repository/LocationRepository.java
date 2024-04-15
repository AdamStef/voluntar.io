package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sumatywny.voluntario.model.event.Location;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Location findFirstById(Long id);
    List<Location> findAllInCity(String city);
}
