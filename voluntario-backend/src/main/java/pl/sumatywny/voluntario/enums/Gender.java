package pl.sumatywny.voluntario.enums;

public enum Gender {
    MALE("male"),
    FEMALE("female");

    private final String label;

    Gender(String label) {
        this.label = label;
    }
}
