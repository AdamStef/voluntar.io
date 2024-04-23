package pl.sumatywny.voluntario.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email(message = "Wrong email format")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    @NotBlank(message = "Password cannot be empty")
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull(message = "User has to have a role")
    private UserRole role;
    
    @Column(nullable = false)
    @NotBlank(message = "First name cannot be empty")
    private String firstName;

    @Column(nullable = false)
    @NotBlank(message = "Last name cannot be empty")
    private String lastName;

    @Column(nullable = false)
    @NotBlank(message = "Phone number cannot be empty")
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(nullable = false)
    private Boolean isDeleted;

    @Column(nullable = false)
    private Boolean isBanned;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}