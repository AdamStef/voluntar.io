package pl.sumatywny.voluntario.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.sumatywny.voluntario.config.roleAnnotations.IsAdmin;
import pl.sumatywny.voluntario.config.roleAnnotations.IsOrganization;
import pl.sumatywny.voluntario.config.roleAnnotations.IsVolunteer;

@RestController()
@RequestMapping("/api/test")
public class TestController {

    @IsAdmin
    @GetMapping("/admin")
    public String admin() {
        return "Hello Admin!";
    }

    @IsVolunteer
    @GetMapping("/volunteer")
    public String volunteer() {
        return "Hello volunteer!";
    }

    @IsOrganization
    @GetMapping("/organization")
    public String organization() {
        return "Hello organization!";
    }
}
