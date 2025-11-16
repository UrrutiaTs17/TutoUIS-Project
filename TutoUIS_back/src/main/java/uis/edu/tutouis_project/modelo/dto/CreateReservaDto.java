package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "DTO para crear una nueva reserva")
public class CreateReservaDto {

    @NotNull(message = "El ID de disponibilidad no puede ser nulo")
    @Positive(message = "El ID de disponibilidad debe ser positivo")
    @Schema(description = "ID de la disponibilidad", example = "1", required = true)
    private Integer idDisponibilidad;

    @NotNull(message = "El ID del usuario no puede ser nulo")
    @Positive(message = "El ID del usuario debe ser positivo")
    @Schema(description = "ID del usuario", example = "4", required = true)
    private Integer idUsuario;

    @Schema(description = "Observaciones adicionales sobre la reserva", example = "Necesito reforzar en Java")
    private String observaciones;

    public CreateReservaDto() {
    }

    public CreateReservaDto(Integer idDisponibilidad, Integer idUsuario) {
        this.idDisponibilidad = idDisponibilidad;
        this.idUsuario = idUsuario;
    }

    public Integer getIdDisponibilidad() {
        return idDisponibilidad;
    }

    public void setIdDisponibilidad(Integer idDisponibilidad) {
        this.idDisponibilidad = idDisponibilidad;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
