package pl.sumatywny.voluntario.service.impl;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.post.PostRequestDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.PermissionsException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organisation;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.PostRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(PostRequestDTO postRequestDTO, Organisation organisation, Event event) {
        Post post = Post.builder()
                .content(postRequestDTO.getContent())
                .organizer(organisation)
                .wasEdited(false)
                .event(event)
                .build();
        return postRepository.save(post);
    }

    public Post getPost(Long postID) {
        return postRepository.findById(postID).orElseThrow(() -> new NoSuchElementException("Post not found."));
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<Post> getAllPostsByOrganizer(User organizer) {
        return postRepository.findAllByOrganizer(organizer);
    }

    public List<Post> getAllPostsByEvent(Event event) {
        return postRepository.findAllByEvent(event, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public void removePost(Long postID, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot remove events.");
        }

        Post post = postRepository.findById(postID).orElseThrow(() -> new NoSuchElementException("Post not found."));
        if (!Objects.equals(user.getId(), post.getOrganizer().getId()) && user.getRole().getRole() != Role.ROLE_ADMIN) {
            System.out.println("nie masz uprawnien");
            throw new PermissionsException("You cannot remove this post.");
        }

        postRepository.delete(post);
    }

    public Post editPost(Long postID, PostRequestDTO postRequestDTO, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot edit events.");
        }

        Post post = postRepository.findById(postID).orElseThrow(() -> new NoSuchElementException("Post not found."));

        if (!Objects.equals(user.getId(), post.getOrganizer().getId()) && user.getRole().getRole() != Role.ROLE_ADMIN) {
            throw new PermissionsException("You cannot edit this post.");
        }

        post.setContent(postRequestDTO.getContent());
        post.setWasEdited(true);
        return postRepository.save(post);
    }

    public void removeAllPostsByEvent(Event event) {
        postRepository.deleteByEventId(event.getId());
    }
}
