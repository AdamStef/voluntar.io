package pl.sumatywny.voluntario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.sumatywny.voluntario.model.notification.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> getNotifications();
    void saveNotification(Notification notification);
    void deleteNotification(Notification notification);

}
