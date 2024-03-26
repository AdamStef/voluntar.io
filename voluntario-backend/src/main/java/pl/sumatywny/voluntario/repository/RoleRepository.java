package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sumatywny.voluntario.model.user.Role;
import pl.sumatywny.voluntario.model.user.UserRole;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByRole(Role name);
}
