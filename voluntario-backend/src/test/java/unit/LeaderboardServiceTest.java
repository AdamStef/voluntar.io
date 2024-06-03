package unit;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.sumatywny.voluntario.dtos.user.ScoreDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.ScoreRepository;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.service.impl.LeaderboardService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class LeaderboardServiceTest {

    @Mock
    private ScoreRepository scoreRepository;

    @Mock
    private UserParticipationRepository userParticipationRepository;

    @InjectMocks
    private LeaderboardService leaderboardService;

    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final User user2 = new User(2L, "vol@test.com", "password", new UserRole(Role.ROLE_ORGANIZATION),
            "Marian", "Kowalczyk", "789456123", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final Score score = new Score();
    private final Score score2 = new Score();

    private final Pageable pageable = PageRequest.of(0, 10);


    private final List<Score> scoreList = List.of(score, score2);

    @Test
    public void getScores() {
        score.setUser(user);
        score.setOverallRating(5);
        score.setPurchasePoints(46);

        score2.setUser(user2);
        score2.setOverallRating(4);
        score2.setPurchasePoints(36);

        when(scoreRepository.findAll(pageable)).thenReturn(new PageImpl<>(scoreList, pageable, scoreList.size()));
        when(userParticipationRepository.countByUserId(1L)).thenReturn(5);
        when(userParticipationRepository.countByUserId(2L)).thenReturn(3);

        var result = leaderboardService.getScores(pageable);

        assertNotNull(result);
        assertEquals(2, result.getTotalElements());

        ScoreDTO score1 = result.getContent().get(0);
        assertEquals(user.getFirstName() + " " + user.getLastName(), score1.getFullName());
        assertEquals(score.getTotalPoints(), score1.getPoints());
        assertTrue(score.getOverallRating() == score1.getRating());
        assertEquals(5, score1.getNumberOfCompletedEvents());

        ScoreDTO score2 = result.getContent().get(1);
        assertEquals(user2.getFirstName() + " " + user2.getLastName(), score2.getFullName());
        assertEquals(score2.getPoints(), result.getContent().get(1).getPoints());
        assertTrue(score2.getRating() == result.getContent().get(1).getRating());
        assertEquals(3, result.getContent().get(1).getNumberOfCompletedEvents());
    }

    @Test
    public void
}
