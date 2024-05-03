package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.EventDTO;
import pl.sumatywny.voluntario.dtos.post.PostResponseDTO;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.LocationService;
import pl.sumatywny.voluntario.service.impl.PostService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AuthService authService;
    private final PostService postService;
    private final LocationService locationService;

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

    @PostMapping("/{eventId}/participants")
    public ResponseEntity<?> addParticipant(@PathVariable("eventId") Long eventId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(eventId));
    }

    @PostMapping("/{eventId}/participants/{participantId}")
    public ResponseEntity<?> addParticipant(
            @PathVariable("eventId") Long eventId,
            @PathVariable("participantId") Long participantId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.addParticipant(eventId, participantId));
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> allParticipants(@PathVariable("eventId") Long eventId) {
        return ResponseEntity.ok().body(eventService.getAllParticipants(eventId));
    }

    @DeleteMapping( "/{eventId}/participants/{participantId}")
    public ResponseEntity<?> removeParticipant(
            @PathVariable(name = "eventId") Long eventId,
            @PathVariable(name = "participantId", required = false) Long participantId) {
//        var user = authService.getUserFromSession();
//            if (Objects.equals(user.getId(), participantId)) {
//                return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventId, user.getId()));
//            }

        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventId, participantId));
//        if (participantId == null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.removeParticipant(eventId, authService.getUserFromSession().getId()));
//        } else {
//        }
    }

    @GetMapping()
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
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

    @GetMapping("/{eventId}/posts")
    public ResponseEntity<?> allPostsByEvent(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        var posts = postService.getAllPostsByEvent(event);
        return ResponseEntity.ok().body(posts.stream().map(PostResponseDTO::mapToDto).toList());
    }

    @GetMapping("/{eventId}/location")
    public ResponseEntity<?> getEventLocation(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        var location = event.getLocation();
        return ResponseEntity.ok().body(location);
    }

    @PutMapping("/{eventId}/location")
    public ResponseEntity<?> updateEventLocation(@PathVariable("eventId") Long eventId, @RequestParam("locationId") Long locationId) {
        eventService.assignNewLocation(eventId, locationId);
        return ResponseEntity.ok().body("Location updated successfully.");
    }

}
