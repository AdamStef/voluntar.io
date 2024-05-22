package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.user.ScoreDTO;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class LeaderboardService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final int limit = 10;

    public List<ScoreDTO> getTopScores() {
        return userRepository.findTopScores(limit);
    }

    public ScoreDTO getUserScore(Long userId) {
        var user = userService.getUserById(userId);
        if (user.getScore() == null) {
            throw new IllegalArgumentException("User has no score");
        }

        var completedEvents = (int) user.getParticipations().stream()
                .filter(participation -> participation.getEvent().getEndDate().isAfter(LocalDateTime.now()))
                .count();

        return ScoreDTO.builder()
                .userId(user.getId())
                .username(user.getFirstName() + " " + user.getLastName())
                .points(user.getScore().getPoints())
                .rating(user.getScore().getRating())
                .numberOfCompletedEvents(completedEvents)
                .build();
    }
}
