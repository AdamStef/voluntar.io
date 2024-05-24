package pl.sumatywny.voluntario.mapper;

import pl.sumatywny.voluntario.dtos.user.UserParticipationDTO;
import pl.sumatywny.voluntario.model.user.UserParticipation;

public class UserParticipationMapper {
    public static UserParticipationDTO mapToDTO(UserParticipation userParticipation) {
        return UserParticipationDTO.builder()
                .userId(userParticipation.getUser().getId())
                .eventId(userParticipation.getEvent().getId())
                .rating(userParticipation.getRating())
                .comment(userParticipation.getComment())
                .build();
    }
}
