package pl.sumatywny.voluntario.model.post;

import jakarta.persistence.*;
import lombok.*;
import pl.sumatywny.voluntario.model.AuditingEntity;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.user.Organization;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "posts")
@Data
@Getter
@Setter
public class Post extends AuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private StringBuilder content;
    @ManyToOne
    private Organization organization;
    @ManyToOne
    private Event event;
    private boolean wasEdited;
}
