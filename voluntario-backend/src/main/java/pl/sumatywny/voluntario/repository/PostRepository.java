package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long id);
    List<Post> findAll();
    List<Post> findAllByOrganizer(User organizer);
    List<Post> findAllByEvent(Event event);
}
