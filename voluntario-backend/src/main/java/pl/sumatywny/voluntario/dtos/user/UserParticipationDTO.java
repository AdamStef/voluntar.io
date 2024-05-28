package pl.sumatywny.voluntario.dtos.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserParticipationDTO {
    private Long userId;
    private Long eventId;
    private int rating;
    private String comment;
}
