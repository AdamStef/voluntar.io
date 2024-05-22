package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.OrganizationDTO;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/registerOrganization/{userID}")
    public ResponseEntity<?> createOrganization(@RequestBody OrganizationDTO organizationDTO, @PathVariable("userID") Long userID) {
        var user = userService.getUserById(userID);
        var organization = organizationService.createOrganization(organizationDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(organization);
    }

    @GetMapping()
    public ResponseEntity<?> getAllOrganizations() {
        return ResponseEntity.ok().body(organizationService.getAllOrganizations());
    }

    @GetMapping("/{organizationID}")
    public ResponseEntity<?> getOrganization(@PathVariable("organizationID") Long organizationID) {
        return ResponseEntity.ok().body(organizationService.getOrganization(organizationID));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrganization() {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok().body(organizationService.getUserOrganization(user.getId()));
    }


}
