package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.sumatywny.voluntario.model.user.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    @Query("SELECT o FROM Organization o WHERE o.user.id = :id")
    Organization findOrganizationByUserId(@Param("id") Long id);
}
