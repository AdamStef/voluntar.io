package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sumatywny.voluntario.service.impl.LeaderboardService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping("/scores")
    public ResponseEntity<?> getTopScores() {
        return ResponseEntity.ok(leaderboardService.getTopScores());
    }

    @GetMapping("/users/{userId}/scores")
    public ResponseEntity<?> getAllScores(@PathVariable Long userId) {
        return ResponseEntity.ok(leaderboardService.getUserScore(userId));
    }
}
