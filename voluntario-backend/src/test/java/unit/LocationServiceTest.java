package unit;


import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import pl.sumatywny.voluntario.dtos.LocationDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.exception.PermissionsException;
import pl.sumatywny.voluntario.model.event.Location;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.LocationRepository;
import pl.sumatywny.voluntario.service.impl.LocationService;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationService locationService;

    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE,
            true, false, false);

    private LocationDTO locationDTO = new LocationDTO("DPS", "Lodz", "93-001", "Kwiatowa",
            "2", "1", 14.01,12.57,"brak");

    private Location location = new Location(1L,"DPS", "Lodz", "Kwiatowa", "Kwiatowa",
            "2", "1", 14.01,12.57,"brak");
    private final Location location2 = new Location(2L, "Schroniskao", "Lodz", "93-000", "Kwiatowa",
            "40", "2", 14.10, 12.00, "wejscie od Lisciastej");
    private final Location location3 = new Location(3L, "Park", "Lodz", "93-000", "Lisciasta",
            "15", "", 13.10, 12.05, "brak");

    @Test
    public void testCreateLocation() {
        Location location = Location.builder()
                .name(locationDTO.getName())
                .city(locationDTO.getCity())
                .postalCode(locationDTO.getPostalCode())
                .street(locationDTO.getStreet())
                .number(locationDTO.getNumber())
                .flatNumber(locationDTO.getFlatNumber())
                .latitude(locationDTO.getLatitude())
                .longitude(locationDTO.getLongitude())
                .additionalInformation(locationDTO.getAdditionalInformation())
                .build();

        when(locationRepository.save(any(Location.class))).thenReturn(location);

        Location createdLocation = locationService.createLocation(locationDTO);

        verify(locationRepository, times(1)).save(any(Location.class));
        assertEquals(location, createdLocation);
    }

    @Test
    public void testGetLocation() {
        when(locationRepository.findFirstById(1L)).thenReturn(location);

        Location retrievedLocation = locationService.getLocation(1L);

        assertNotNull(retrievedLocation);
        assertEquals(location, retrievedLocation);
        verify(locationRepository, times(1)).findFirstById(1L);
    }

    @Test
    public void testGetLocationNotFound() {
        when(locationRepository.findFirstById(2L)).thenReturn(null);

        var error = assertThrows(NoSuchElementException.class, ()-> locationService.getLocation(2L));
        assertEquals("Location not found.", error.getMessage());
        verify(locationRepository, times(1)).findFirstById(2L);
    }

    @Test
    public void getAllLocations() {
        when(locationRepository.findAll()).thenReturn(List.of(location, location2, location3));
        var result = locationService.getAllLocations();
        assertEquals(3, result.size());
        assertEquals(location, result.get(0));
        assertEquals(location2, result.get(1));
        assertEquals(location3, result.get(2));

    }

    @Test
    public void removeLocation() {
        when(locationRepository.findFirstById(1L)).thenReturn(location);

        assertDoesNotThrow(() -> {
            locationService.removeLocation(1L, user);
        });

        verify(locationRepository, times(1)).delete(location);
    }

    @Test
    public void removeLocationError() {
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));
        var exception = assertThrows(PermissionsException.class, ()-> locationService.removeLocation(1L, user));
        assertEquals("Volunteers cannot remove locations.", exception.getMessage());
        user.setRole(new UserRole(Role.ROLE_ORGANIZATION));

        var exception2 = assertThrows(NoSuchElementException.class, ()-> locationService.removeLocation(5L, user));
        assertEquals("Location not found.", exception2.getMessage());
    }

    @Test
    public void editLocation() {
        when(locationRepository.findFirstById(1L)).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);

        Location editedLocation = locationService.editLocation(1L, locationDTO, user);

        assertEquals(locationDTO.getName(), editedLocation.getName());
        assertEquals(locationDTO.getCity(), editedLocation.getCity());
        assertEquals(locationDTO.getPostalCode(), editedLocation.getPostalCode());
        assertEquals(locationDTO.getStreet(), editedLocation.getStreet());
        assertEquals(locationDTO.getNumber(), editedLocation.getNumber());
        assertEquals(locationDTO.getFlatNumber(), editedLocation.getFlatNumber());
        assertTrue(locationDTO.getLatitude() == editedLocation.getLatitude());
        assertTrue(locationDTO.getLongitude() == editedLocation.getLongitude());
        assertEquals(locationDTO.getAdditionalInformation(), editedLocation.getAdditionalInformation());

        verify(locationRepository, times(1)).save(location);
    }

    @Test
    public void editLocationError() {
        user.setRole(new UserRole(Role.ROLE_VOLUNTEER));
        var exception = assertThrows(PermissionsException.class, ()-> locationService.editLocation(1L,locationDTO, user));
        assertEquals("Volunteers cannot edit locations.", exception.getMessage());
        user.setRole(new UserRole(Role.ROLE_ORGANIZATION));

        var exception2 = assertThrows(NoSuchElementException.class, ()-> locationService.editLocation(5L,locationDTO, user));
        assertEquals("Location not found.", exception2.getMessage());
    }


}
