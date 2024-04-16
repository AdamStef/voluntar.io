package pl.sumatywny.voluntario.repository;

import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAll();
    Event findFirstById(Long id);
}
