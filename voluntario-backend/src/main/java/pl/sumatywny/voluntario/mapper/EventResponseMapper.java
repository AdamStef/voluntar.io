package pl.sumatywny.voluntario.mapper;

import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.model.event.Event;

public class EventResponseMapper {
    public static EventResponseDTO mapToDTO(Event event) {
        return EventResponseDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .organization(OrganizationMapper.mapToDTO(event.getOrganization()))
//                .participants(event.getParticipations().stream().map(UserParticipationMapper::mapToDTO).toList())
                .numberOfVolunteersNeeded(event.getNumberOfVolunteersNeeded())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
//                .posts(event.getPosts())
                .location(event.getLocation())
                .isCompleted(event.getIsCompleted())
                .build();
    }
}
