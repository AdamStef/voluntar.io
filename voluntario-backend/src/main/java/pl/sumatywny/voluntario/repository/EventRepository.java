package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAllByNameContainingIgnoreCase(String name, Pageable pageable);
//    @Query("SELECT e FROM Event e JOIN FETCH e.location WHERE e.id = :id")
    Optional<Event> findById(Long id);
    List<Event> findAllByOrganization_Id(Long id);

//    List<Event> findAllByUserId(Long userId);
//    List<Event> findByStartDate(int year, int month, int day);
//    List<Event> findByEndDate(int year, int month, int day);
}
