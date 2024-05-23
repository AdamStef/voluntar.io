package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

//    Optional<Event> findById(Long id);

    List<Event> findAllByOrganizationId(Long id);
}