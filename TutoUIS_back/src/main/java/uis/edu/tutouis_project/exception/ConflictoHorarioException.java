package uis.edu.tutouis_project.exception;

/**
 * Excepción personalizada para conflictos de horario en tutorías
 */
public class ConflictoHorarioException extends RuntimeException {
    
    public ConflictoHorarioException(String mensaje) {
        super(mensaje);
    }
    
    public ConflictoHorarioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
