package pl.sumatywny.voluntario.dtos.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.dtos.user.UserParticipationDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
public class EventResponseDTO {
    private Long id;
    private String name;
    private String description;
    private OrganizationResponseDTO organization;
    private List<UserParticipationDTO> participants;
    private int numberOfVolunteersNeeded;
//    ?
    private int numberOfVolunteers;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
//    private List<PostResponseDTO> posts;
    private Location location;
    private EventStatus status;

    public EventResponseDTO(Event event) {
        this.id = event.getId();
        this.name = event.getName();
        this.description = event.getDescription();
        this.organization = new OrganizationResponseDTO(event.getOrganization());

//        List<UserParticipationDTO> userParticipationDTOS = new ArrayList<>();
//        Hibernate.initialize(event.getParticipations());
//        for (UserParticipation userParticipation: event.getParticipations()) {
//            userParticipationDTOS.add(new UserParticipationDTO(userParticipation));
//        }
//        this.participants = userParticipationDTOS;
        this.participants = event.getParticipations().stream().map(participant -> {
            UserParticipationDTO userParticipationDTO = new UserParticipationDTO(participant);
            return userParticipationDTO;
        }).collect(Collectors.toList());
        this.numberOfVolunteersNeeded = event.getNumberOfVolunteersNeeded();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.location = event.getLocation();
        this.status = event.getStatus();
    }
}
