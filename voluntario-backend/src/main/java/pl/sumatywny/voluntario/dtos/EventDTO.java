package pl.sumatywny.voluntario.dtos;


import lombok.*;
import pl.sumatywny.voluntario.model.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventDTO {
    private Long id;
    private String name;
    private String description;
//    private User organizer;
    private int numberOfVolunteersNeeded;
//    private List<User> participants;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long locationId;
}
