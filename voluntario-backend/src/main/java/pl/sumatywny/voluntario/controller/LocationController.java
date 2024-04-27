package pl.sumatywny.voluntario.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.LocationDTO;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.LocationService;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationService locationService;
    private final AuthService authService;

    public LocationController(LocationService locationService, AuthService authService) {
        this.locationService = locationService;
        this.authService = authService;
    }

    @PostMapping()
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> createLocation(@RequestBody LocationDTO locationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locationService.createLocation(locationDTO, authService.getUserFromSession()));
    }

    @PutMapping("/{locationID}")
    public ResponseEntity<?> editLocation(@PathVariable("locationID") Long locationID, @RequestBody LocationDTO locationDTO) {
        return ResponseEntity.ok().body(locationService.editLocation(locationID, locationDTO, authService.getUserFromSession()));
    }

    @GetMapping("/{locationID}")
    public ResponseEntity<?> getLocation(@PathVariable("locationID") Long locationID) {
        return ResponseEntity.ok().body(locationService.getLocation(locationID));
    }

    @GetMapping()
    public ResponseEntity<?> getAllLocations() {
        return ResponseEntity.ok().body(locationService.getAllLocations());
    }

    @DeleteMapping("/{locationID}")
    public ResponseEntity<?> removeLocation(@PathVariable("locationID") Long locationID) {
        locationService.removeLocation(locationID, authService.getUserFromSession());
        return ResponseEntity.noContent().build();
    }
}
