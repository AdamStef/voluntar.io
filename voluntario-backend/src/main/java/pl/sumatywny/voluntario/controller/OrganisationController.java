package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.OrganisationDTO;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.OrganisationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/organisations")
public class OrganisationController {

    private final OrganisationService organisationService;
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/registerOrganisation/{userID}")
    public ResponseEntity<?> createOrganisation(@RequestBody OrganisationDTO organisationDTO, @PathVariable("userID") Long userID) {
        var user = userService.getUserById(userID);
        var organisation = organisationService.createOrganisation(organisationDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(organisation);
    }

    @GetMapping()
    public ResponseEntity<?> getAllOrganisations() {
        return ResponseEntity.ok().body(organisationService.getAllOrganisations());
    }

    @GetMapping("/{organisationID}")
    public ResponseEntity<?> getOrganisation(@PathVariable("organisationID") Long organisationID) {
        return ResponseEntity.ok().body(organisationService.getOrganisation(organisationID));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrganisation() {
        var user = authService.getUserFromSession();
        return ResponseEntity.ok().body(organisationService.getUserOrganisation(user.getId()));
    }


}
