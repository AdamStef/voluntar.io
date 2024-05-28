package pl.sumatywny.voluntario.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.User;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrganization(Organization organization);

    List<Post> findAllByEvent(Event event, Sort sort);
    List<Post> findAllByEventId(Long eventId, Sort sort);

    @Modifying
    @Query("delete from Post p where p.event.id = :id")
    void deleteByEventId(Long id);
}
