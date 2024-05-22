package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.config.roleAnnotations.IsOrganization;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final AuthService authService;
    private final UserService userService;
    private final OrganizationService organizationService;

    @PostMapping()
    @IsOrganization
    public ResponseEntity<?> create(@RequestBody EventDTO eventDTO) {
        var user = authService.getUserFromSession();
        var organization = organizationService.getUserOrganization(user.getId());
        var event = eventService.createEvent(eventDTO, organization);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PostMapping("/{eventId}/participants")
    public ResponseEntity<?> addParticipant(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        var participant = authService.getUserFromSession();
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(event, participant));
    }

    @PostMapping("/{eventId}/participants/{participantId}")
    public ResponseEntity<?> addParticipant(
            @PathVariable("eventId") Long eventId,
            @PathVariable("participantId") Long participantId) {
        var event = eventService.getEvent(eventId);
        var participant = userService.getUserById(participantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(event, participant));
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> allParticipants(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        return ResponseEntity.ok().body(eventService.getUsersParticipating(event));
    }

    @DeleteMapping("/{eventId}/participants/{participantId}")
    public ResponseEntity<?> removeParticipant(
            @PathVariable(name = "eventId") Long eventId,
            @PathVariable(name = "participantId", required = false) Long participantId) {
//        var user = authService.getUserFromSession();
//            if (Objects.equals(user.getId(), participantId)) {
//                return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventId, user.getId()));
//            }
        User user;
        if (participantId == null) {
            user = authService.getUserFromSession();
        } else {
            user = userService.getUserById(participantId);
        }

        var event = eventService.getEvent(eventId);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(event, user));
    }

    @GetMapping()
    public ResponseEntity<?> allEvents(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok().body(eventService.getAllEvents(search, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/organization")
//    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> getOrganizationEvents() {
        User user = authService.getUserFromSession();
        var organization = organizationService.getUserOrganization(user.getId());
        return ResponseEntity.ok().body(eventService.getOrganizationEvents(organization));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<?> event(@PathVariable("eventId") Long eventId) {
        return ResponseEntity.ok().body(eventService.getEvent(eventId));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> removeEvent(@PathVariable("eventId") Long eventId) {
        eventService.removeEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/location")
    public ResponseEntity<?> getEventLocation(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        var location = event.getLocation();
        return ResponseEntity.ok().body(location);
    }

    @PutMapping("/{eventId}/location")
    public ResponseEntity<?> updateEventLocation(
            @PathVariable("eventId") Long eventId,
            @RequestParam("locationId") Long locationId) {
        return ResponseEntity.ok().body(eventService.assignNewLocation(eventId, locationId));
    }

}
