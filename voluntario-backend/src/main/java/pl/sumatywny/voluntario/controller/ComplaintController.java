package pl.sumatywny.voluntario.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintRequestDTO;
import pl.sumatywny.voluntario.dtos.complaint.ComplaintResponseDTO;
import pl.sumatywny.voluntario.model.complaint.Status;
import pl.sumatywny.voluntario.service.UserService;
import pl.sumatywny.voluntario.service.impl.AuthService;
import pl.sumatywny.voluntario.service.impl.ComplaintService;

@Controller
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final AuthService authService;
    private final UserService userService;

    public ComplaintController(ComplaintService complaintService, AuthService authService, UserService userService) {
        this.complaintService = complaintService;
        this.authService = authService;
        this.userService = userService;

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
        return ResponseEntity.ok().body(complaintService.claimComplaint(complaintID, authService.getUserFromSession().getId()));
    }

    //    @IsAdmin
    @PostMapping("/resolve/{complaintID}")
    public ResponseEntity<?> resolveComplaint(@PathVariable("complaintID") Long complaintID,
                                              @RequestBody ComplaintResponseDTO complaintResponseDTO) throws IllegalAccessException {
        return ResponseEntity.ok().body(complaintService.resolveComplaint(complaintID, complaintResponseDTO,
                authService.getUserFromSession()));
    }

    @PostMapping("/")
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintRequestDTO complaintRequestDTO) {
        return ResponseEntity.ok().body(complaintService.createComplaint(complaintRequestDTO, authService.getUserFromSession()));
    }

    @GetMapping("/resolved")
    public ResponseEntity<?> getResolvedComplaints() {
        complaintService.getComplaintsByStatus(Status.RESOLVED);
        return ResponseEntity.ok().body(complaintService.getComplaintsByStatus(Status.RESOLVED));
    }

    @GetMapping("/toReview")
    public ResponseEntity<?> getToReviewComplaints() {
        return ResponseEntity.ok().body(complaintService.getComplaintsByStatus(Status.TO_REVIEW));
    }

    @GetMapping("/underReview")
    public ResponseEntity<?> getUnderReviewComplaints() {
        return ResponseEntity.ok().body(complaintService.getComplaintsByStatus(Status.UNDER_REVIEW));
    }

    @GetMapping(value = {"/on/{userID}", "/on/me"})
    public ResponseEntity<?> getComplaintsOnUser(@PathVariable(name = "userID", required = false) Long userID) {
        if (userID == null) {
            return ResponseEntity.ok().body(complaintService.allComplaintsOnUser(authService.getUserFromSession()));
        } else {
            return ResponseEntity.ok().body(complaintService.allComplaintsOnUser(userService.getUserById(userID)));
        }
    }

    @GetMapping(value = {"/by/{userID}", "/by/me"})
    public ResponseEntity<?> getComplaintsByUser(@PathVariable(name = "userID", required = false) Long userID) {
        if (userID == null) {
            return ResponseEntity.ok().body(complaintService.allComplaintsByUser(authService.getUserFromSession()));
        } else {
            return ResponseEntity.ok().body(complaintService.allComplaintsByUser(userService.getUserById(userID)));
        }
    }

}
