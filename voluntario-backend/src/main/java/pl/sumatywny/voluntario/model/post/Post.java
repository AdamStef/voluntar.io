package pl.sumatywny.voluntario.model.post;

import jakarta.persistence.*;
import lombok.*;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime creationDate;
    private StringBuilder content;
    @ManyToOne
    private User organizer; //TODO: jak będzie klasa użytkownika organizatora to zamienić
    @ManyToOne
    private Event event;
    private boolean wasEdited;
}
