package pl.sumatywny.voluntario.mapper;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.event.EventRequestDTO;
import pl.sumatywny.voluntario.model.event.Event;

@Service
public class EventMapper {
    public EventRequestDTO toEventDTO(Event event) {
        return EventRequestDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .numberOfVolunteersNeeded(event.getNumberOfVolunteersNeeded())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .build();
    }
}
