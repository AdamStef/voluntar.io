package pl.sumatywny.voluntario.model.notification;

public class Notification {

    private String title;
    private String message;

    public Notification(String message, String title) {
        this.message = message;
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void show() {
        System.out.println(title + ": " + message);
    }
}
