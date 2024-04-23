package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.sumatywny.voluntario.enums.Role;
import pl.sumatywny.voluntario.model.user.UserRole;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByRole(Role role);
    @Query("SELECT r FROM UserRole r WHERE r.role = :name")
    Optional<UserRole> findByRoleName(String name);
}
