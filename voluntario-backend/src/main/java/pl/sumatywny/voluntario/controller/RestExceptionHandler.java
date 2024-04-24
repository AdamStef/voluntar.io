package pl.sumatywny.voluntario.controller;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.sumatywny.voluntario.dtos.ExceptionResponse;
import pl.sumatywny.voluntario.exception.NotFoundException;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.core.Ordered.HIGHEST_PRECEDENCE;
import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
@Order(HIGHEST_PRECEDENCE)
public class RestExceptionHandler {
    private record ExceptionDetails(String message, HttpStatus httpStatus, ZonedDateTime timestamp) { }

   @ExceptionHandler(value = {RuntimeException.class, UnsupportedOperationException.class})
   public ResponseEntity<?> runTimeException(Exception ex) {
        ex.printStackTrace();
       var exceptionDetails = new ExceptionDetails(
               ex.getMessage(),
               INTERNAL_SERVER_ERROR,
               ZonedDateTime.now(ZoneId.of("UTC"))
       );
       return new ResponseEntity<>(exceptionDetails, INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> illegalStateException(Exception e) {
         var exceptionDetails = new ExceptionDetails(
                e.getMessage(),
                CONFLICT,
                ZonedDateTime.now(ZoneId.of("UTC"))
         );
         return new ResponseEntity<>(exceptionDetails, BAD_REQUEST);
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<?> authenticationException(Exception e) {
        var exceptionDetails = new ExceptionDetails(
                e.getMessage(),
                UNAUTHORIZED,
                ZonedDateTime.now(ZoneId.of("UTC"))
        );
        return new ResponseEntity<>(exceptionDetails, UNAUTHORIZED);
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public ResponseEntity<?> accessDenied(Exception e) {
        var exceptionDetails = new ExceptionDetails(
                e.getMessage(),
                FORBIDDEN,
                ZonedDateTime.now(ZoneId.of("UTC"))
        );
        return new ResponseEntity<>(exceptionDetails, FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException ex) {
        Set<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toSet());

        var exceptionResponse = ExceptionResponse.builder()
                .errorCode(BAD_REQUEST.value())
                .validationErrors(errors)
                .build();
        return ResponseEntity.status(BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(NotFoundException ex) {
        var exceptionResponse = ExceptionResponse.builder()
                .errorCode(NOT_FOUND.value())
                .error("Not found")
                .errorDescription(ex.getMessage())
                .build();
        return ResponseEntity.status(NOT_FOUND).body(exceptionResponse);
    }
}
