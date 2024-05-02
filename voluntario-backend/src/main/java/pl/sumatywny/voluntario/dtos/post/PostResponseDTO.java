package pl.sumatywny.voluntario.dtos.post;

import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.model.post.Post;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponseDTO {
    private Long id;
    private StringBuilder content;
    private Long organizerId;
    private Long eventId;
    private boolean wasEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponseDTO mapToDto(Post post) {
        return PostResponseDTO.builder()
                .id(post.getId())
                .content(post.getContent())
                .organizerId(post.getOrganizer().getId())
                .eventId(post.getEvent().getId())
                .wasEdited(post.isWasEdited())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
