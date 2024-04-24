package pl.sumatywny.voluntario.repository;

import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAll();
    Event findFirstById(Long id);
//    List<Event> findAllByUserId(Long userId);
//    List<Event> findByStartDate(int year, int month, int day);
//    List<Event> findByEndDate(int year, int month, int day);
}
