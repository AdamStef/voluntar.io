package pl.sumatywny.voluntario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;

@SpringBootApplication
public class VoluntarioApplication {
	@Autowired
	private RoleRepository roleRepository;

	public static void main(String[] args) {
		SpringApplication.run(VoluntarioApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner() {
		return args -> {
			for (Role role : Role.values()) {
				if (roleRepository.findByRole(role).isEmpty()) {
					roleRepository.save(new UserRole(role));
				}
			}
		};
	}
	
}
