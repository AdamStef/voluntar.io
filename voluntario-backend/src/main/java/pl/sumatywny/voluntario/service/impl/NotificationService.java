package pl.sumatywny.voluntario.service.impl;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.sumatywny.voluntario.dtos.event.EventResponseDTO;
import pl.sumatywny.voluntario.dtos.user.UserParticipationDTO;
import pl.sumatywny.voluntario.service.UserService;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {
    private final EmailService emailService;
    private final EventService eventService;
    private final UserService userService;

    public NotificationService(EmailService emailService, EventService eventService, UserService userService) {
        this.emailService = emailService;
        this.eventService = eventService;
        this.userService = userService;
    }

    @Scheduled(cron = "0 00 10 * * ?")
    public void sendEventReminders() {
        List<EventResponseDTO> events = eventService.getSoonEvents();
        for (EventResponseDTO event : events) {
            List<UserParticipationDTO> participants = event.getParticipants();
            for (UserParticipationDTO participant : participants) {
                var user = userService.getUserById(participant.getUserId());
                String subject = "Przypomnienie: Nadchodzący wolontariat - " + event.getName();
                String text = "Drogi wolontariuszu \\ wolontariuszko" +
                        ",\n\nprzypominamy o nadchodzącym wolontariacie \"" + event.getName() +
                        "\", na który się zapisałeś\\aś." + "\nOdbędzie się on jutro (" +
                        event.getStartDate().toLocalDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) +
                        ") o godzinie " + event.getStartDate().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")) +
                        ". \nPamiętaj o sprawdzeniu aktualności zamieszczanych przez organizatora w zakładce wydarzenia \"Dyskusja\". \nDo zobaczenia na miejscu!"
                        + "\n\nPozdrawiamy,\nZespół Voluntar.io";
                emailService.sendEmail(user.getEmail(), subject, text);
            }
        }
    }
}
