package pl.sumatywny.voluntario.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationRequestDTO;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/registerOrganization/{userID}")
    public ResponseEntity<?> createOrganization(@RequestBody OrganizationRequestDTO organizationRequestDTO, @PathVariable("userID") Long userID) {
        var user = userService.getUserById(userID);
        organizationService.createOrganization(organizationRequestDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
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
        return ResponseEntity.ok().body(new OrganizationResponseDTO(organizationService.getUserOrganization(user.getId())));
    }

    @PostMapping("/verify/{organizationID}")
    public ResponseEntity<?> verifyOrganization(@PathVariable("organizationID") Long organizationID) {
        return ResponseEntity.ok().body(organizationService.verifyOrganization(organizationID));
    }

//    @PostMapping("/changeData/{organizationID}")
//    @PutMapping("/changeData/{organizationID}")
    @PostMapping("/update/{id}")
    public ResponseEntity<OrganizationResponseDTO> updateOrganizationData(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String website = request.get("website");

        OrganizationResponseDTO updatedOrganization= authService.getOrganizationFromSession();
        organizationService.updateOrganizationData(id, name, website);
        return ResponseEntity.ok(updatedOrganization);
    }


}
