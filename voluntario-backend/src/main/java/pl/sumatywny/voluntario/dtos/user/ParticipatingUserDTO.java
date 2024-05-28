package pl.sumatywny.voluntario.dtos.user;

import lombok.Builder;
import lombok.Data;
import pl.sumatywny.voluntario.enums.Gender;

@Builder
@Data
public class ParticipatingUserDTO {
    private Long userId;
    private Long eventId;
    private String email;
    private String name;
    private String phoneNumber;
    private Gender gender;
//    private double rating;
//    private String comment;
}
