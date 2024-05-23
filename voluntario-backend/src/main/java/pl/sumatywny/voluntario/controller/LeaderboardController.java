package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.service.impl.LeaderboardService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LeaderboardController {
    @Autowired
    private final LeaderboardService leaderboardService;

//    @GetMapping("/scores")
//    public ResponseEntity<?> getTopScores(@RequestParam(defaultValue = "10") int limit) {
//        return ResponseEntity.ok(leaderboardService.getTopScores(limit));
//    }

    @GetMapping("/users/{userId}/scores")
    public ResponseEntity<?> getUserScores(@PathVariable Long userId) {
        return ResponseEntity.ok(leaderboardService.getUserScore(userId));
    }

    @GetMapping("/scores")
    public ResponseEntity<?> getAllScores(
            @PageableDefault(sort = "totalPoints", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(leaderboardService.getScores(pageable));
    }
}
