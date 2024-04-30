package pl.sumatywny.voluntario.service.impl;

import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.PostDTO;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.NotFoundException;
import pl.sumatywny.voluntario.exception.PermissionsException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.repository.PostRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(PostDTO postDTO, User user, Event event) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot create events.");
        }

        Post post = Post.builder()
                .content(postDTO.getContent())
                .creationDate(LocalDateTime.now())
                .organizer(user)
                .wasEdited(false)
                .event(event) //TODO: jakoś przekazywać z frontendu ten event
                .build();
        return postRepository.save(post);
    }

    public Post getPost(Long postID) {
        Post post = postRepository.findFirstById(postID);
        if (post == null) {
            throw new NotFoundException("Post not found.");
        }

        return post;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getAllPostsByOrganizer(User organizer) {
        return postRepository.findAllByOrganizer(organizer);
    }

    public List<Post> getAllPostsByEvent(Event event) {
        return postRepository.findAllByEvent(event);
    }

    public void removePost(Long postID, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot remove events.");
        }

        Post post = postRepository.findFirstById(postID);
        if(user.getId() != post.getOrganizer().getId() && user.getRole().getRole() != Role.ROLE_ADMIN) {
            System.out.println("nie masz uprawnien");
            throw new PermissionsException("You cannot remove this post.");
        }
        if (post == null) {
            throw new NotFoundException("Post not found.");
        }

        postRepository.delete(post);
    }

    public Post editPost(Long postID, PostDTO postDTO, User user) {
        if (user.getRole().getRole() == Role.ROLE_VOLUNTEER) {
            throw new PermissionsException("Volunteers cannot edit events.");
        }

        Post post = postRepository.findFirstById(postID);
        if (post == null) {
            throw new NotFoundException("Post not found.");
        }

        if(user.getId() != post.getOrganizer().getId() && user.getRole().getRole() != Role.ROLE_ADMIN) {
            throw new PermissionsException("You cannot edit this post.");
        }

        post.setContent(postDTO.getContent());
        post.setWasEdited(true);
        return postRepository.save(post);
    }
}
