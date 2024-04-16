package pl.sumatywny.voluntario.repository;

import pl.sumatywny.voluntario.model.notification.Notification;

import java.util.List;

public interface NotificationRepository {

    List<Notification> getNotifications();
    void saveNotification(Notification notification);
    void deleteNotification(Notification notification);

}
