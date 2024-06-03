package pl.sumatywny.voluntario.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.sumatywny.voluntario.model.user.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    @Query("SELECT o FROM Organization o WHERE o.user.id = ?1")
    Organization findOrganizationByUserId(Long id);

    // New method to find unverified organizations
    List<Organization> findByVerifiedFalse();
}
