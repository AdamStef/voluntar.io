package pl.sumatywny.voluntario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.UserRole;
import pl.sumatywny.voluntario.repository.RoleRepository;

@SpringBootApplication
@EnableScheduling
@EnableAsync
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
