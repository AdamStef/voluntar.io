package pl.sumatywny.voluntario.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;

@RestController
@RequestMapping("/api/event")
public class EventController {

    private final EventService eventService;
    private AuthService authService;

    public EventController(EventService eventService, AuthService authService) {
        this.eventService = eventService;
        this.authService = authService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> register(@RequestBody EventDTO eventDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(eventDTO, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/addParticipant/{eventID}")
    public ResponseEntity<?> addVolunteer(@PathVariable Long eventID){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addVolunteer(eventID, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/removeParticipant/{eventID}")
    public ResponseEntity<?> removeVolunteer(@PathVariable Long eventID){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeVolunteer(eventID, authService.getUserFromSession().get().getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/allParticipants/{eventID}")
    public ResponseEntity<?> allParticipants(@PathVariable Long eventID){
        try {
            return ResponseEntity.ok().body(eventService.getAllParticipants(eventID));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/allEvents")
    public ResponseEntity<?> allEvents(){
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/{eventID}")
    public ResponseEntity<?> event(@PathVariable Long eventID){
        return ResponseEntity.ok().body(eventService.getEvent(eventID));
    }
}
