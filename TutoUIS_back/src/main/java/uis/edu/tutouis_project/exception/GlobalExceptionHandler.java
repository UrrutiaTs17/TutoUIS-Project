package uis.edu.tutouis_project.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para la aplicación
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Maneja las excepciones de conflicto de horario
     */
    @ExceptionHandler(ConflictoHorarioException.class)
    public ResponseEntity<Map<String, String>> handleConflictoHorario(ConflictoHorarioException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "CONFLICTO_HORARIO");
        error.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    /**
     * Maneja excepciones generales
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "ERROR_INTERNO");
        error.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
