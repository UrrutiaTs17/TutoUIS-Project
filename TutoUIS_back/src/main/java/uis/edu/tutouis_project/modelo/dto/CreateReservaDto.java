package uis.edu.tutouis_project.modelo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalTime;

@Schema(description = "DTO para crear una nueva reserva")
public class CreateReservaDto {

    @NotNull(message = "El ID de disponibilidad no puede ser nulo")
    @Positive(message = "El ID de disponibilidad debe ser positivo")
    @Schema(description = "ID de la disponibilidad", example = "1", required = true)
    private Integer idDisponibilidad;

    @NotNull(message = "El ID del estudiante no puede ser nulo")
    @Positive(message = "El ID del estudiante debe ser positivo")
    @Schema(description = "ID del estudiante", example = "4", required = true)
    private Integer idEstudiante;

    @Schema(description = "Observaciones adicionales sobre la reserva", example = "Necesito reforzar en Java")
    private String observaciones;

    @NotNull(message = "La hora de inicio no puede ser nula")
    @JsonFormat(pattern = "HH:mm:ss")
    @Schema(description = "Hora de inicio de la reserva (HH:mm:ss)", example = "08:00:00", required = true)
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin no puede ser nula")
    @JsonFormat(pattern = "HH:mm:ss")
    @Schema(description = "Hora de fin de la reserva (HH:mm:ss)", example = "08:15:00", required = true)
    private LocalTime horaFin;

    @NotNull(message = "La modalidad no puede ser nula")
    @Schema(description = "Modalidad de la tutoría (Presencial o Virtual)", example = "Presencial", required = true)
    private String modalidad;

    public CreateReservaDto() {
    }

    public CreateReservaDto(Integer idDisponibilidad, Integer idEstudiante) {
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
    }

    public CreateReservaDto(Integer idDisponibilidad, Integer idEstudiante, LocalTime horaInicio, LocalTime horaFin) {
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    public Integer getIdDisponibilidad() {
        return idDisponibilidad;
    }

    public void setIdDisponibilidad(Integer idDisponibilidad) {
        this.idDisponibilidad = idDisponibilidad;
    }

    public Integer getIdEstudiante() {
        return idEstudiante;
    }

    public void setIdEstudiante(Integer idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }
}
