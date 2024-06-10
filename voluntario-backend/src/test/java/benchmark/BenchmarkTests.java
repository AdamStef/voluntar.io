package benchmark;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openjdk.jmh.annotations.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import pl.sumatywny.voluntario.dtos.event.EventRequestDTO;
import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.enums.Gender;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.Organization;
import pl.sumatywny.voluntario.model.user.Score;
import pl.sumatywny.voluntario.model.user.User;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.service.impl.EventService;
import pl.sumatywny.voluntario.service.impl.OrganizationService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class BenchmarkTests {
    @State(Scope.Benchmark)
    public static class BenchmarkState {
        User user;
        Organization organization;

        @Setup
        public void setup() {
            user = new User(1L, "test@test.com", "testpassword", new UserRole(Role.ROLE_ORGANIZATION),
                    "Jan", "Kowalski", "555111222", new ArrayList<>(), new Score(), Gender.MALE, null,
                    true, false, false);
            organization = new Organization(1L, user, "Wolontariaty", "pomagamy", "00000000",
                    "Lodz, piotrkowska", "help.org.pl", true,
                    LocalDateTime.of(2024, 5, 30, 12, 0, 0),
                    LocalDateTime.of(2024, 5, 31, 12, 0, 0));
        }
    }

    private EventService eventService;
    private OrganizationService organizationService;

    @Benchmark
    @BenchmarkMode(Mode.AverageTime)
    @OutputTimeUnit(TimeUnit.MILLISECONDS)
    public void eventTest(BenchmarkState state) {
        EventRequestDTO eventRequestDTO = EventRequestDTO.builder()
                .name("Test event")
                .description("Test description")
                .startDate(LocalDateTime.of(2024, 5, 30, 12, 0, 0))
                .endDate(LocalDateTime.of(2024, 5, 31, 12, 0, 0))
                .build();

        eventService.createEvent(eventRequestDTO, state.organization);

    }
}
