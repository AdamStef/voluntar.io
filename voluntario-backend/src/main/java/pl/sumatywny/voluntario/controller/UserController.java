package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.service.impl.UserServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserServiceImpl userServiceImpl;

    public UserController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    //    @IsAdmin
    @GetMapping("/all")
    public ResponseEntity<?> allUsers() {
        return ResponseEntity.ok().body(userServiceImpl.getAllUsers());
    }

    @GetMapping("/{userId}/comments")
    public ResponseEntity<List<String>> getUserComments(@PathVariable Long userId) {
        List<String> comments = userServiceImpl.getUserComments(userId);
        if (comments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping("/ban/{userID}")
    public ResponseEntity<?> banUser(@PathVariable("userID") Long userID) {
        return ResponseEntity.ok().body(userServiceImpl.banUser(userID));
    }

}