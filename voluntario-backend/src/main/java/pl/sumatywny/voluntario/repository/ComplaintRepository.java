package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.sumatywny.voluntario.model.complaint.Complaint;
import pl.sumatywny.voluntario.model.complaint.Status;
import pl.sumatywny.voluntario.model.user.User;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    @Query("SELECT c FROM Complaint c WHERE c.status = :status")
    List<Complaint> getComplaintByStatus(@Param("status") Status status);

    List<Complaint> getComplaintByReporter(User user);

    List<Complaint> getComplaintByReported(User user);
}
