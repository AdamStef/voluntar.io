package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.service.impl.UserServiceImpl;

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
}