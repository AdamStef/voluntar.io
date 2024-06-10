package unit;


import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import pl.sumatywny.voluntario.service.impl.EmailService;

import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(MockitoExtension.class)
public class EamilServiceTest {
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendEmail() {
        String to = "test@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        emailService.sendEmail(to, subject, body);

        // Create a SimpleMailMessage with the expected values
        SimpleMailMessage expectedMessage = new SimpleMailMessage();
        expectedMessage.setTo(to);
        expectedMessage.setSubject(subject);
        expectedMessage.setText(body);

        // Verify that mailSender.send() was called with the expected message
        verify(mailSender, times(1)).send(refEq(expectedMessage));
    }

}
