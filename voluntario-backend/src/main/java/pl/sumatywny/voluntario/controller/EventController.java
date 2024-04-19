package pl.sumatywny.voluntario.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AuthService authService;

    public EventController(EventService eventService, AuthService authService) {
        this.eventService = eventService;
        this.authService = authService;
    }

    @PostMapping()
    public ResponseEntity<?> register(@RequestBody EventDTO eventDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(eventDTO, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/{eventID}/participants")
    public ResponseEntity<?> addParticipant(@PathVariable("eventID") Long eventID) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(eventID, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = {"/{eventID}/participants", "/{eventID}/participants/{participantID}"})
    public ResponseEntity<?> removeParticipant(@PathVariable(name = "eventID") Long eventID, @PathVariable(name = "participantID", required = false) Long participantID) {
        try {
            if (participantID == null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventID, authService.getUserFromSession().get().getId()));
            } else {
                return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventID, participantID));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{eventID}/participants")
    public ResponseEntity<?> allParticipants(@PathVariable("eventID") Long eventID) {
        try {
            return ResponseEntity.ok().body(eventService.getAllParticipants(eventID));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/{eventID}")
    public ResponseEntity<?> event(@PathVariable("eventID") Long eventID) {
        try {
            return ResponseEntity.ok().body(eventService.getEvent(eventID));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{eventID}")
    public ResponseEntity<?> removeEvent(@PathVariable("eventID") Long eventID) {
        try {
            return ResponseEntity.ok().body(eventService.removeEvent(eventID));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
