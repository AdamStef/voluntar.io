package pl.sumatywny.voluntario.model.post;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "posts")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private StringBuilder content;
    @ManyToOne
    private User organizer; //TODO: jak będzie klasa użytkownika organizatora to zamienić
    @ManyToOne
    private Event event;
    private boolean wasEdited;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
