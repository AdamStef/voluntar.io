package pl.sumatywny.voluntario.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> createLocation(@RequestBody LocationDTO locationDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(locationService.createLocation(locationDTO, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/{locationID}")
    public ResponseEntity<?> editLocation(@PathVariable("locationID") Long locationID, @RequestBody LocationDTO locationDTO) {
        try {
            return ResponseEntity.ok().body(locationService.editLocation(locationID, locationDTO, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{locationID}")
    public ResponseEntity<?> getLocation(@PathVariable("locationID") Long locationID) {
        try {
            return ResponseEntity.ok().body(locationService.getLocation(locationID));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<?> getAllLocations() {
        try {
            return ResponseEntity.ok().body(locationService.getAllLocations());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/{locationID}")
    public ResponseEntity<?> removeLocation(@PathVariable("locationID") Long locationID) {
        try {
            return ResponseEntity.ok().body(locationService.removeLocation(locationID, authService.getUserFromSession()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



}
