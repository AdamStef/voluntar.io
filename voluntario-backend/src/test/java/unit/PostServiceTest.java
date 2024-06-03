package unit;


import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import pl.sumatywny.voluntario.dtos.post.PostRequestDTO;
import pl.sumatywny.voluntario.enums.EventStatus;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.PermissionsException;
import pl.sumatywny.voluntario.model.event.Event;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.post.Post;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.PostRepository;
import pl.sumatywny.voluntario.service.impl.PostService;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @Captor
    private ArgumentCaptor<Post> postCaptor;

    private final PostRequestDTO postRequestDTO = new PostRequestDTO(new StringBuilder("PostEDIT"));

    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final User user2 = new User(2L, "vol@test.com", "password", new UserRole(Role.ROLE_ORGANIZATION),
            "Marian", "Kowalczyk", "789456123", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);
    private final Organization organization = new Organization(1L, user, "Wolontariaty", "pomagamy", "00000000",
            "Lodz, piotrkowska", "help.org.pl", true,
            LocalDateTime.of(2024, 5, 30, 12, 0, 0),
            LocalDateTime.of(2024, 5, 31, 12, 0, 0));
    private final Location location = new Location(1L, "DPS", "Lodz", "93-000", "Kwiatowa",
            "1", "2", 14.01, 12.00, "wejscie od Lisciastej");
    private final Location location2 = new Location(1L, "Schroniskao", "Lodz", "93-000", "Kwiatowa",
            "40", "2", 14.10, 12.00, "wejscie od Lisciastej");
    private final Event event = new Event(1L, "Pomoc starszym", "pomoc w DPSie", organization,
            10, new ArrayList<>(),
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(3),
            new ArrayList<>(), location, EventStatus.NOT_COMPLETED);
    private final Event event2 = new Event(1L, "Pomoc schronisku", "wyprowadzenie zwierząt", organization,
            5, new ArrayList<>(),
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(3),
            new ArrayList<>(), location2, EventStatus.NOT_COMPLETED);

    private final Post post = new Post(1L, new StringBuilder("post"), organization, event, false);
    private final Post post2 = new Post(2L, new StringBuilder("post2"), organization, event2, false);
    private final Post post3 = new Post(3L, new StringBuilder("post3"), organization, event, false);

    @Test
    public void createPost() {
        when(postRepository.save(ArgumentMatchers.any())).thenReturn(post);
        Post result = postService.createPost(postRequestDTO, organization, event);

        verify(postRepository, times(1)).save(postCaptor.capture());

        Post capturedPost = postCaptor.getValue();
        assertEquals(postRequestDTO.getContent(), capturedPost.getContent());
        assertEquals(organization, capturedPost.getOrganization());
        assertFalse(capturedPost.isWasEdited());
        assertEquals(event, capturedPost.getEvent());
        assertEquals(post, result);
    }

    @Test
    public void getPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        var result = postService.getPost(1L);
        assertEquals(post, result);

        when(postRepository.findById(3L)).thenReturn(Optional.empty());
        var result2 = assertThrows(NoSuchElementException.class, ()-> postService.getPost(3L));
        assertEquals("Post not found.", result2.getMessage());
    }

    @Test
    public void getAllPosts() {
        when(postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(List.of(post, post2, post3));
        var result = postService.getAllPosts();
        assertEquals(3, result.size());
        assertEquals(post, result.get(0));
        assertEquals(post2, result.get(1));
        assertEquals(post3, result.get(2));
    }

    @Test
    public void getAllPostsByOrganization() {
        List<Post> expectedPosts = Arrays.asList(post, post2, post3);

        when(postRepository.findAllByOrganization(organization)).thenReturn(expectedPosts);

        List<Post> result = postService.getAllPostsByOrganization(organization);

        verify(postRepository, times(1)).findAllByOrganization(organization);
        assertEquals(expectedPosts, result);
    }

    @Test
    public void getAllPostsByEvent() {
        post.setCreatedAt(LocalDateTime.now().minusDays(3));
        post2.setCreatedAt(LocalDateTime.now().minusDays(2));
        post3.setCreatedAt(LocalDateTime.now().minusDays(1));
        List<Post> expectedPosts = Arrays.asList(post, post3);
        List<Post> expectedPosts2 = Arrays.asList(post2);

        when(postRepository.findAllByEventId(1L, Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(expectedPosts);
        when(postRepository.findAllByEventId(2L, Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(expectedPosts2);
        List<Post> result = postService.getAllPostsByEvent(1L);
        List<Post> result2 = postService.getAllPostsByEvent(2L);

        verify(postRepository, times(1)).findAllByEventId(1L, Sort.by(Sort.Direction.DESC, "createdAt"));
        verify(postRepository, times(1)).findAllByEventId(2L, Sort.by(Sort.Direction.DESC, "createdAt"));
        assertEquals(expectedPosts, result);
        assertEquals(expectedPosts2, result2);
    }

    @Test
    public void removePost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertDoesNotThrow(() -> postService.removePost(1L, user));
        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).delete(post);
    }

    @Test
    public void removePostAdmin() {
        user2.setRole(new UserRole(Role.ROLE_ADMIN));
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertDoesNotThrow(() -> postService.removePost(1L, user2));
        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).delete(post);
        user2.setRole(new UserRole(Role.ROLE_ORGANIZATION));
    }

    @Test
    public void removePostPermissionsException() {
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));

        PermissionsException exception = assertThrows(PermissionsException.class, () -> postService.removePost(1L, user));
        assertEquals("Volunteers cannot remove events.", exception.getMessage());

        verify(postRepository, never()).findById(anyLong());
        verify(postRepository, never()).delete(ArgumentMatchers.any());
        user.setRole(new UserRole(Role.ROLE_ORGANIZATION));
    }

    @Test
    public void removePostNoPostFound() {
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, ()-> postService.removePost(4L, user));
        assertEquals("Post not found.", exception.getMessage());
        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, never()).delete(ArgumentMatchers.any());
    }

    @Test
    public void removePostNotOwner() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PermissionsException exception = assertThrows(PermissionsException.class, ()-> postService.removePost(1L, user2));
        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, never()).delete(ArgumentMatchers.any());
    }

    @Test
    public void editPostByVolunteer() {
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));

        PermissionsException exception = assertThrows(PermissionsException.class, () -> postService.editPost(1L, postRequestDTO, user));
        assertEquals("Volunteers cannot edit events.", exception.getMessage());

        verify(postRepository, never()).findById(anyLong());
        verify(postRepository, never()).save(ArgumentMatchers.any());
        user.setRole(new UserRole(Role.ROLE_ORGANIZATION));
    }

    @Test
    public void editPostNoPostFound() {
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, ()-> postService.editPost(4L, postRequestDTO, user));
        assertEquals("Post not found.", exception.getMessage());
        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, never()).delete(ArgumentMatchers.any());
    }

    @Test
    public void editPostNotOwner() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PermissionsException exception = assertThrows(PermissionsException.class, ()-> postService.editPost(1L, postRequestDTO, user2));
        assertEquals("You cannot edit this post.", exception.getMessage());
        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, never()).delete(ArgumentMatchers.any());
    }

    @Test
    public void editPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertDoesNotThrow(() -> {
            postService.editPost(1L,postRequestDTO, user);
        });

        when(postRepository.save(ArgumentMatchers.any())).thenAnswer(invocation -> invocation.getArgument(0));

        Post updatedPost = postService.editPost(1L, postRequestDTO, user);

        assertNotNull(updatedPost);
        assertEquals(postRequestDTO.getContent(), updatedPost.getContent());
        assertTrue(updatedPost.isWasEdited());
        verify(postRepository, times(2)).findById(1L);
        verify(postRepository, times(2)).save(ArgumentMatchers.any());
    }

    @Test
    public void removeAllPostsByEvent() {
//        when(postRepository.deleteByEventId(1L)).thenReturn(Optional.of(post));
        postService.removeAllPostsByEvent(event);
        verify(postRepository, times(1)).deleteByEventId(event.getId());


    }
}
