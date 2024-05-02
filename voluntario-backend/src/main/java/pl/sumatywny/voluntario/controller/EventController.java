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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final AuthService authService;
    private final UserService userService;

    @PostMapping()
    @IsOrganization
    public ResponseEntity<?> create(@RequestBody EventDTO eventDTO) {
        var user = authService.getUserFromSession();
//            if (user.isEmpty()) {
//                var response = ExceptionResponse.builder()
//                        .errorCode(HttpStatus.UNAUTHORIZED.value())
//                        .error("Unauthorized")
//                        .errorDescription("User not found.")
//                        .build();
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//            }
        var event = eventService.createEvent(eventDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PostMapping("/{eventID}/participants")
    public ResponseEntity<?> addParticipant(@PathVariable("eventID") Long eventID) {
        var event = eventService.getEvent(eventID);
        var participant = authService.getUserFromSession();
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(event, participant));
    }

    @PostMapping("/{eventID}/participants/{participantID}")
    public ResponseEntity<?> addParticipant(
            @PathVariable("eventID") Long eventID,
            @PathVariable("participantID") Long participantID) {
        var event = eventService.getEvent(eventID);
        var participant = userService.getUserById(participantID);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(event, participant));
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> allParticipants(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        return ResponseEntity.ok().body(eventService.getAllParticipants(event));
    }

    @DeleteMapping( "/{eventID}/participants/{participantID}")
    public ResponseEntity<?> removeParticipant(
            @PathVariable(name = "eventID") Long eventID,
            @PathVariable(name = "participantID", required = false) Long participantID) {
        User user;
        if (participantID == null) {
            user = authService.getUserFromSession();
        }
        else {
            user = userService.getUserById(participantID);
        }

        var event = eventService.getEvent(eventID);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(event, user));
    }

    @GetMapping()
    public ResponseEntity<?> allEvents(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok().body(eventService.getAllEvents(search, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/{eventID}")
    public ResponseEntity<?> event(@PathVariable("eventID") Long eventID) {
        return ResponseEntity.ok().body(eventService.getEvent(eventID));
    }

    @DeleteMapping("/{eventID}")
    public ResponseEntity<?> removeEvent(@PathVariable("eventID") Long eventID) {
        eventService.removeEvent(eventID);
        return ResponseEntity.noContent().build();
    }
}
