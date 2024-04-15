package pl.sumatywny.voluntario.repository;

import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAll();
    List<Event> findAllByUserId(Long userId);
    List<Event> findByStartDate(int year, int month, int day);
    List<Event> findByEndDate(int year, int month, int day);
}
