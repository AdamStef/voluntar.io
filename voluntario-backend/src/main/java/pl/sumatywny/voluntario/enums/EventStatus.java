package pl.sumatywny.voluntario.enums;

import lombok.Getter;

@Getter
public enum EventStatus {
    NOT_COMPLETED("Niezakończone"),
    COMPLETED("Zakończone"),
    EVALUATED("Ocenione"),
    CANCELED("Anulowane");

    private final String status;

    EventStatus(String status) {
        this.status = status;
    }

    public static EventStatus fromString(String status) {
        for (EventStatus eventStatus : EventStatus.values()) {
            if (eventStatus.status.equalsIgnoreCase(status)) {
                return eventStatus;
            }
        }
        return null;
    }

    public boolean isNotCompleted() {
        return this.equals(NOT_COMPLETED);
    }

    public boolean isFinished() {
        return this.ordinal() >= COMPLETED.ordinal() && !this.equals(CANCELED);
    }

    public boolean isGreaterThan(EventStatus status) {
        return this.ordinal() > status.ordinal();
    }

    public boolean isGreaterThanOrEqual(EventStatus status) {
        return this.ordinal() >= status.ordinal();
    }
}

//public enum EventStatus {
//    NOT_COMPLETED,
//    COMPLETED,
//    EVALUATED,
//    CANCELED;
//}

