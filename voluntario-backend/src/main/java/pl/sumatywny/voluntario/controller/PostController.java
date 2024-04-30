package pl.sumatywny.voluntario.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.PostDTO;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final AuthService authService;
    private final EventService eventService;

    public PostController(PostService postService, AuthService authService, EventService eventService) {
        this.postService = postService;
        this.authService = authService;
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO, @RequestParam("eventID") Long eventID) {
        return ResponseEntity.ok().body(postService.createPost(postDTO, authService.getUserFromSession(), eventService.getEvent(eventID)));
    }

    @PutMapping("/{postID}")
    public ResponseEntity<?> editPost(@PathVariable("postID") Long postID, @RequestBody PostDTO postDTO) {
        return ResponseEntity.ok().body(postService.editPost(postID, postDTO, authService.getUserFromSession()));
    }

    @GetMapping("/{postID}")
    public ResponseEntity<?> getPost(@PathVariable("postID") Long postID) {
        return ResponseEntity.ok().body(postService.getPost(postID));
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok().body(postService.getAllPosts());
    }

    @DeleteMapping("/{postID}")
    public ResponseEntity<?> removePost(@PathVariable("postID") Long postID) {
        postService.removePost(postID, authService.getUserFromSession());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/{eventID}")
    public ResponseEntity<?> getAllPostsByEvent(@PathVariable("eventID") Long eventID) {
        return ResponseEntity.ok().body(postService.getAllPostsByEvent(eventService.getEvent(eventID)));
    }

}
