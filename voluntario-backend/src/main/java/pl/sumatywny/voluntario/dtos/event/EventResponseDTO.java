package pl.sumatywny.voluntario.dtos.event;

import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.dtos.OrganizationDTO;
import pl.sumatywny.voluntario.dtos.user.UserParticipationDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.model.event.Location;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventResponseDTO {
    private Long id;
    private String name;
    private String description;
    private OrganizationDTO organization;
    private List<UserParticipationDTO> participants;
    private int numberOfVolunteersNeeded;
    private int numberOfVolunteers;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
//    private List<PostResponseDTO> posts;
    private Location location;
    private EventStatus status;
}
