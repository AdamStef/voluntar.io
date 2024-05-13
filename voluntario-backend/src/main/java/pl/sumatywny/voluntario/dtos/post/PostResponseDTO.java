package pl.sumatywny.voluntario.dtos.post;

import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organisation;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponseDTO {
    private Long id;
    private StringBuilder content;
    private Organisation organization;
    private Long eventId;
    private boolean wasEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponseDTO mapToDto(Post post) {
        return PostResponseDTO.builder()
                .id(post.getId())
                .content(post.getContent())
                .organization(post.getOrganizer())
                .eventId(post.getEvent().getId())
                .wasEdited(post.isWasEdited())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
