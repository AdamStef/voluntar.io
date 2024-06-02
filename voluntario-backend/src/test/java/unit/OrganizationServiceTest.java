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
import pl.sumatywny.voluntario.dtos.oragnization.*;
import pl.sumatywny.voluntario.dtos.oragnization.OrganizationRequestDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.OrganizationRepository;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

import java.time.LocalDateTime;
import java.util.ArrayList;

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

    private final OrganizationRequestDTO organizationRequestDTO = new OrganizationRequestDTO(1L, "Organizacja", "opis",
            "00001111", "Piotrkowska 111 Lodz", "www.strona.org.pl");


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

    }

}
