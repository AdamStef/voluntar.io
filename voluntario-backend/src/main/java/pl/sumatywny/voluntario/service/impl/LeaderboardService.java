package pl.sumatywny.voluntario.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.sumatywny.voluntario.dtos.user.ScoreDTO;
import pl.sumatywny.voluntario.dtos.user.UserEvaluationDTO;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserParticipation;
import pl.sumatywny.voluntario.repository.ScoreRepository;
import pl.sumatywny.voluntario.repository.UserParticipationRepository;
import pl.sumatywny.voluntario.repository.UserRepository;
import pl.sumatywny.voluntario.service.UserService;

import java.util.List;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
@Service
public class LeaderboardService {
    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;
    private final UserParticipationRepository userParticipationRepository;
    private final UserService userService;

    public List<ScoreDTO> getTopScores(int limit) {
//        var scores = scoreRepository.findTopScores(limit);
//        return scores.stream()
//                .map(score -> ScoreDTO.builder()
//                        .fullName(score.getUser().getFirstName() + " " + score.getUser().getLastName())
//                        .points(score.getTotalPoints())
//                        .rating(score.getOverallRating())
//                        .build())
//                .toList();
        return null;
    }

    @Transactional
    public Page<ScoreDTO> getScores(Pageable pageable) {
        return scoreRepository.findAll(pageable)
//                PageRequest.of(pageable.getPageNumber(),
//                        pageable.getPageSize(),
//                        Sort.by(Sort.Direction.DESC, "totalPoints", "overallRating", "COUNT(p)")))
                .map(score -> {
            var participationsCount = userParticipationRepository.countByUserId(score.getUser().getId());
            return ScoreDTO.builder()
                    .userId(score.getUser().getId())
                    .fullName(score.getUser().getFirstName() + " " + score.getUser().getLastName())
                    .points(score.getTotalPoints())
                    .rating(score.getOverallRating())
                    .numberOfCompletedEvents(participationsCount)
                    .build();
        });
    }

    @Transactional
    public void addScore(UserEvaluationDTO evaluation) {
        var user = userRepository.findById(evaluation.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found."));

        var score = scoreRepository.findByUserId(user.getId()).orElse(null);
        if (score == null) {
            score = new Score();
            score.setUser(user);
            score.setTotalPoints(0);
            score.setOverallRating(0.0);
            score.setPurchasePoints(0);
        }

//        var completedEventsSize = user.getParticipations().stream()
//                .filter(participation -> participation.getEvent().getStatus().isFinished())
//                .count();

        score.setTotalPoints(score.getTotalPoints() + evaluation.getRating());
        score.setPurchasePoints(score.getPurchasePoints() + evaluation.getRating());
        score.setOverallRating(score.getTotalPoints() / 5.0);
        score.setUser(user);
        scoreRepository.save(score);
    }

    public ScoreDTO getUserScore(Long userId) {
        var user = userService.getUserById(userId);
        if (user.getScore() == null) {
            throw new IllegalArgumentException("User has no score");
        }

        var completedEvents = user.getParticipations().stream()
                .filter(participation -> participation.getEvent().getStatus().isFinished())
                .toList();

        int points = completedEvents.stream()
                .map(UserParticipation::getRating)
                .reduce(0, Integer::sum);

        var rating = points / (double) completedEvents.size();

        return ScoreDTO.builder()
                .fullName(user.getFirstName() + " " + user.getLastName())
                .points(points)
                .rating(rating)
                .numberOfCompletedEvents(completedEvents.size())
                .build();
    }
}
