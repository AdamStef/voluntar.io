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
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationRequestDTO;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationResponseDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.OrganizationRepository;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class OrganizationServiceTest {


    @Mock
    private OrganizationRepository organizationRepository;

    @InjectMocks
    private OrganizationService organizationService;

    private final User user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
            "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final User user2 = new User(2L, "vol@test.com", "password", new UserRole(Role.ROLE_ORGANIZATION),
            "Marian", "Kowalczyk", "789456123", new ArrayList<>(), new Score(), Gender.MALE, null,
            true, false, false);

    private final OrganizationRequestDTO organizationRequestDTO = new OrganizationRequestDTO(1L, "Organizacja", "nowy opis",
            "00001111", "Kwiatowa 111 Lodz", "www.strona.com.pl");


    private final Organization organization = new Organization(1L, user, "Organizacja", "opis",
            "00001111", "Piotrkowska 111 Lodz", "www.strona.org.pl", false, LocalDateTime.now(), LocalDateTime.now().minusDays(1));
    private final Organization organization2 = new Organization(2L, user2, "Organizacja2", "opis2",
            "00002222", "Piotrkowska 222 Lodz", "www.strona2.org.pl", true, LocalDateTime.now(), LocalDateTime.now().minusDays(1));



    @Test
    public void testCreateOrganization_SuccessfulCreation() {
        LocalDateTime beforeCreation = LocalDateTime.now();

        when(organizationRepository.save(any(Organization.class))).thenAnswer(invocation -> {
            Organization org = invocation.getArgument(0);
            org.setId(1L);
            return org;
        });

        Organization createdOrganization = organizationService.createOrganization(organizationRequestDTO, user);

        assertNotNull(createdOrganization.getId());
        assertEquals(organizationRequestDTO.getName(), createdOrganization.getName());
        assertEquals(organizationRequestDTO.getDescription(), createdOrganization.getDescription());
        assertEquals(organizationRequestDTO.getWebsite(), createdOrganization.getWebsite());
        assertEquals(organizationRequestDTO.getAddress(), createdOrganization.getAddress());
        assertEquals(organizationRequestDTO.getKrs(), createdOrganization.getKrs());
        assertEquals(user, createdOrganization.getUser());
        assertFalse(createdOrganization.isVerified());
        assertNull(createdOrganization.getVerificationDate());
        assertTrue(createdOrganization.getCreationDate().isAfter(beforeCreation));

        verify(organizationRepository, times(1)).save(any(Organization.class));
    }

    @Test
    public void getAllOrganizations() {
        when(organizationRepository.findAll()).thenReturn(List.of(organization, organization2));
        var result = organizationService.getAllOrganizations();
        assertEquals(2, result.size());
        assertEquals(result.get(0).getId(), organization.getId());
        assertEquals(result.get(0).getName(), organization.getName());
        assertEquals(result.get(0).getDescription(), organization.getDescription());
        assertEquals(result.get(0).getAddress(), organization.getAddress());
        assertEquals(result.get(0).getKrs(), organization.getKrs());
        assertEquals(result.get(0).getWebsite(), organization.getWebsite());
        verify(organizationRepository, times(1)).findAll();
    }

    @Test
    public void getOrganization() {
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(organization));
        when(organizationRepository.findById(3L)).thenReturn(Optional.empty());
        var error = assertThrows(NoSuchElementException.class, ()-> organizationService.getOrganization(3L));
        assertEquals("Organization 3 not found.",error.getMessage());
        var result = organizationService.getOrganization(1L);
        assertNotNull(result);
        assertEquals(result.getId(), organization.getId());
        assertEquals(result.getName(), organization.getName());
        assertEquals(result.getDescription(), organization.getDescription());
        assertEquals(result.getAddress(), organization.getAddress());
        assertEquals(result.getKrs(), organization.getKrs());
        assertEquals(result.getWebsite(), organization.getWebsite());
    }

    @Test
    public void getUserOrganization() {
        when(organizationRepository.findOrganizationByUserId(1L)).thenReturn(organization);
        when(organizationRepository.findOrganizationByUserId(2L)).thenReturn(organization2);

        var result = organizationService.getUserOrganization(user.getId());
        var result2 = organizationService.getUserOrganization(user2.getId());

        assertNotNull(result);
        assertNotNull(result2);

        assertEquals(result.getId(), organization.getId());
        assertEquals(result.getName(), organization.getName());
        assertEquals(result.getDescription(), organization.getDescription());
        assertEquals(result.getAddress(), organization.getAddress());
        assertEquals(result.getKrs(), organization.getKrs());
        assertEquals(result.getWebsite(), organization.getWebsite());

        assertEquals(result2.getId(), organization2.getId());
        assertEquals(result2.getName(), organization2.getName());
        assertEquals(result2.getDescription(), organization2.getDescription());
        assertEquals(result2.getAddress(), organization2.getAddress());
        assertEquals(result2.getKrs(), organization2.getKrs());
        assertEquals(result2.getWebsite(), organization2.getWebsite());

    }

    @Test
    public void verifyOrganization() {
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(organization));
        when(organizationRepository.findById(3L)).thenReturn(Optional.empty());
        var error = assertThrows(NoSuchElementException.class, ()-> organizationService.verifyOrganization(3L));
        assertEquals("Organization 3 not found.", error.getMessage());
        assertEquals("Organization 1 verified successfully", organizationService.verifyOrganization(1L));
        verify(organizationRepository,times(2)).findById(any());
        verify(organizationRepository,times(1)).save(any());
    }

    @Test
    public void testGetUnverifiedOrganizations() {
        organization.setVerified(false);
        List<Organization> unverifiedOrganizations = List.of(organization);
        when(organizationRepository.findByVerifiedFalse()).thenReturn(unverifiedOrganizations);

        List<OrganizationResponseDTO> result = organizationService.getUnverifiedOrganizations();

        assertEquals(1, result.size());
        assertEquals(new OrganizationResponseDTO(organization), result.get(0));
    }

    @Test
    public void testUpdateOrganizationData() {
        Long organizationId = 1L;
        String newName = "New Name";
        String newWebsite = "www.example.com";

        var org = new Organization(1L, user, newName, "opis",
                "00001111", "Piotrkowska 111 Lodz", newWebsite, false, LocalDateTime.now(), LocalDateTime.now().minusDays(1));

        when(organizationRepository.findById(organizationId)).thenReturn(Optional.of(organization));
        when(organizationRepository.save(any())).thenReturn(org);

        OrganizationResponseDTO updatedOrganizationResponse = organizationService.updateOrganizationData(organizationId, newName, newWebsite);

        assertNotNull(updatedOrganizationResponse);
        assertEquals(newName, updatedOrganizationResponse.getName());
        assertEquals(newWebsite, updatedOrganizationResponse.getWebsite());
        verify(organizationRepository, times(1)).findById(organizationId);
        verify(organizationRepository, times(1)).save(organization);
    }

    @Test
    public void testUpdateOrganizationData_OrganizationNotFound() {
        Long organizationId = 1L;
        String newName = "New Name";
        String newWebsite = "www.example.com";

        when(organizationRepository.findById(organizationId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> organizationService.updateOrganizationData(organizationId, newName, newWebsite));
        verify(organizationRepository, times(1)).findById(organizationId);
        verify(organizationRepository, never()).save(any());
    }

}
