package pl.sumatywny.voluntario.mapper;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.model.event.Event;

@Service
public class EventMapper {
    public EventDTO toEventDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .numberOfVolunteersNeeded(event.getNumberOfVolunteersNeeded())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .build();
    }
}
