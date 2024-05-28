package pl.sumatywny.voluntario.dtos.complaint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.sumatywny.voluntario.dtos.user.UserResponseDTO;
import pl.sumatywny.voluntario.model.complaint.Complaint;
import pl.sumatywny.voluntario.model.complaint.Status;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ComplaintResponseDTO {
    Long id;
    UserResponseDTO reporter;
    String textComplaint;
    UserResponseDTO reported;
    LocalDateTime reportDate;
    LocalDateTime claimDate;
    LocalDateTime resolveDate;
    Status status;
    String response;

    public ComplaintResponseDTO(Complaint complaint) {
        this.id = complaint.getId();
        this.reporter = UserResponseDTO.mapFromUser(complaint.getReporter());
        this.textComplaint = complaint.getTextComplaint();
        this.reported = UserResponseDTO.mapFromUser(complaint.getReported());
        this.reportDate = complaint.getReportDate();
        this.claimDate = complaint.getClaimDate();
        this.resolveDate = complaint.getResolveDate();
        this.status = complaint.getStatus();
        this.response = complaint.getResponse();
    }
}
