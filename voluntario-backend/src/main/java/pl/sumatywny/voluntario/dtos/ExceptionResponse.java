package pl.sumatywny.voluntario.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.Map;
import java.util.Set;

@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExceptionResponse {
    private Integer errorCode;
    private String errorDescription;
    private String error;
    private Set<String> validationErrors;
    private Map<String, String> errors;
}
