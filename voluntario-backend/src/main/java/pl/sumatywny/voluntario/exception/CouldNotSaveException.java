package pl.sumatywny.voluntario.exception;

public class CouldNotSaveException extends RuntimeException {
    public CouldNotSaveException(String message) {
        super(message);
    }
}
