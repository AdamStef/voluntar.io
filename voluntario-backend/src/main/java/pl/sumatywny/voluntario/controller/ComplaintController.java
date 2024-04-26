package pl.sumatywny.voluntario.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintRequestDTO;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintResponseDTO;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.ComplaintService;

@Controller
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final AuthService authService;

    public ComplaintController(ComplaintService complaintService, AuthService authService) {
        this.complaintService = complaintService;
        this.authService = authService;
    }

    //    @IsAdmin
    @GetMapping("/")
    public ResponseEntity<?> allComplaints() {
        return ResponseEntity.ok().body(complaintService.getAllComplaints());
    }

    @GetMapping("/{complaintID}")
    public ResponseEntity<?> complaint(@PathVariable("complaintID") Long complaintID) {
        return ResponseEntity.ok().body(complaintService.getComplaint(complaintID));
    }

    //    @IsAdmin
    @PostMapping("/claim/{complaintID}")
    public ResponseEntity<?> claimComplaint(@PathVariable("complaintID") Long complaintID) {
        return ResponseEntity.ok().body(complaintService.claimComplaint(complaintID, authService.getUserFromSession().get().getId()));
    }

    //    @IsAdmin
    @PostMapping("/resolve/{complaintID}")
    public ResponseEntity<?> resolveComplaint(@PathVariable("complaintID") Long complaintID,
                                              @RequestBody ComplaintResponseDTO complaintResponseDTO) throws IllegalAccessException {
        return ResponseEntity.ok().body(complaintService.resolveComplaint(complaintID, complaintResponseDTO,
                authService.getUserFromSession().get()));
    }

    //    @IsAdmin
    @PostMapping("/")
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintRequestDTO complaintRequestDTO) {
        return ResponseEntity.ok().body(complaintService.createComplaint(complaintRequestDTO, authService.getUserFromSession().get()));
    }


}
