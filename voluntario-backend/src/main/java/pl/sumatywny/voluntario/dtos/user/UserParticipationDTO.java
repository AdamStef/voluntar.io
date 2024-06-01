package pl.sumatywny.voluntario.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.sumatywny.voluntario.model.user.UserParticipation;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserParticipationDTO {
    private Long userId;
    private Long eventId;
    private int rating;
    private String comment;

    public UserParticipationDTO(UserParticipation userParticipation) {
        this.userId = userParticipation.getUser().getId();
        this.eventId = userParticipation.getEvent().getId();
        this.rating = userParticipation.getRating();
        this.comment = userParticipation.getComment();
    }
}
