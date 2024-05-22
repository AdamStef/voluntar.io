package pl.sumatywny.voluntario.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.post.PostRequestDTO;
import pl.sumatywny.voluntario.dtos.post.PostResponseDTO;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;
import pl.sumatywny.voluntario.service.impl.PostService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PostController {
    private final PostService postService;
    private final AuthService authService;
    private final EventService eventService;
    private final OrganizationService organizationService;

    @PostMapping("/events/{eventId}/posts")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> createPost(
            @RequestBody PostRequestDTO postRequestDTO,
            @PathVariable("eventId") Long eventId) {
        var user = authService.getUserFromSession();
        var organization = organizationService.getUserOrganization(user.getId());
        var event = eventService.getEvent(eventId);
        var post = postService.createPost(postRequestDTO, organization, event);
        return ResponseEntity.ok().body(PostResponseDTO.mapToDto(post));
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<?> editPost(@PathVariable("postId") Long postId, @RequestBody PostRequestDTO postRequestDTO) {
        var user = authService.getUserFromSession();
        var post = postService.editPost(postId, postRequestDTO, user);
        return ResponseEntity.ok().body(PostResponseDTO.mapToDto(post));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPost(@PathVariable("postId") Long postId) {
        var post = postService.getPost(postId);
        return ResponseEntity.ok().body(PostResponseDTO.mapToDto(post));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok().body(postService.getAllPosts().stream().map(PostResponseDTO::mapToDto).toList());
    }

    @GetMapping("/events/{eventId}/posts")
    public ResponseEntity<?> allPostsByEvent(@PathVariable("eventId") Long eventId) {
        var event = eventService.getEvent(eventId);
        var posts = postService.getAllPostsByEvent(event);
        return ResponseEntity.ok().body(posts.stream().map(PostResponseDTO::mapToDto).toList());
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> removePost(@PathVariable("postId") Long postId) {
        postService.removePost(postId, authService.getUserFromSession());
        return ResponseEntity.noContent().build();
    }
}
