package pl.sumatywny.voluntario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.sumatywny.voluntario.model.notification.Notification;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;
import pl.sumatywny.voluntario.repository.UserRepository;

@SpringBootApplication
public class VoluntarioApplication {
//	@Autowired
//	private UserRepository userRepository;
//
//	@Autowired
//	private RoleRepository roleRepository;
//
//	@Autowired
//	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		// test for notifications - uncomment
//		Notification notification = new Notification("Nowe powiadomienie!", "W dniu dzisiejszym jesteś zapisany na wolontariat!!!");
//		notification.show();
		SpringApplication.run(VoluntarioApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner commandLineRunner() {
//		return args -> {
//			System.out.println("Encoded password: " + passwordEncoder.encode("testpassword"));
//			System.out.println("Encoded password: " + passwordEncoder.encode("testpassword"));
//			UserRole adminRole = new UserRole(1, Role.ROLE_ADMIN);
//			UserRole volunteerRole = new UserRole(2, Role.ROLE_VOLUNTEER);
//			UserRole organizationRole = new UserRole(3, Role.ROLE_ORGANIZATION);
//
//			roleRepository.save(adminRole);
//			roleRepository.save(volunteerRole);
//			roleRepository.save(organizationRole);
//		};
//	}
	
}
