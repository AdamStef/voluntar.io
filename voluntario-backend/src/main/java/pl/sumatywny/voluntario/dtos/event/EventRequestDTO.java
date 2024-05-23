package pl.sumatywny.voluntario.dtos.event;


import lombok.*;
import pl.sumatywny.voluntario.dtos.LocationDTO;

import java.time.LocalDateTime;

@Data
@Builder
public class EventRequestDTO {
    private Long id;
    private String name;
    private String description;
//    private User organizer;
    private int numberOfVolunteersNeeded;
//    private List<User> participants;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocationDTO location;
}
