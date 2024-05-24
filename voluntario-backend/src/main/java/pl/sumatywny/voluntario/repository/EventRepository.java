package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
//    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.participations WHERE e.id = :id")
    @EntityGraph(attributePaths = {"participations", "organization", "location"})
    Optional<Event> findById(Long id);

    @Query("SELECT e FROM Event e JOIN FETCH e.organization WHERE e.organization.id = :id")
    List<Event> findAllByOrganizationId(Long id);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.participations")
//    @EntityGraph(attributePaths = {"participations", "organization", "location"})
    List<Event> findAllWithParticipants();

    @Query("""
            SELECT e FROM Event e LEFT JOIN FETCH e.participations
                WHERE (CASE WHEN :name IS NULL OR :name = '' THEN true END)
                OR lower(e.name) LIKE lower(concat('%', :name, '%'))
            """)
    Page<Event> findAllByNameWithParticipantsPageable(String name, Pageable pageable);
}