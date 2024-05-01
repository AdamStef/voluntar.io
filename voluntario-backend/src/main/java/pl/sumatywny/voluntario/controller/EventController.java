package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.EventDTO;
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
//    @IsOrganization
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
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(eventID));
    }

    @PostMapping("/{eventID}/participants/{participantID}")
    public ResponseEntity<?> addParticipant(
            @PathVariable("eventID") Long eventID,
            @PathVariable("participantID") Long participantID) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(eventID, participantID));
    }

    @GetMapping("/{eventID}/participants")
    public ResponseEntity<?> allParticipants(@PathVariable("eventID") Long eventID) {
        return ResponseEntity.ok().body(eventService.getAllParticipants(eventID));
    }

    @DeleteMapping( "/{eventID}/participants/{participantID}")
    public ResponseEntity<?> removeParticipant(
            @PathVariable(name = "eventID") Long eventID,
            @PathVariable(name = "participantID", required = false) Long participantID) {
//        var user = authService.getUserFromSession();
//            if (Objects.equals(user.getId(), participantID)) {
//                return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventID, user.getId()));
//            }

        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventID, participantID));
//        if (participantID == null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventID, authService.getUserFromSession().getId()));
//        } else {
//        }
    }

    @GetMapping()
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
