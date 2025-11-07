package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para actualizar una reserva existente")
public class UpdateReservaDto {

    @Schema(description = "Observaciones de la reserva", example = "Cambio en mis observaciones")
    private String observaciones;

    @Schema(description = "Razón de cancelación si aplica", example = "No puedo asistir")
    private String razonCancelacion;

    public UpdateReservaDto() {
    }

    public UpdateReservaDto(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getRazonCancelacion() {
        return razonCancelacion;
    }

    public void setRazonCancelacion(String razonCancelacion) {
        this.razonCancelacion = razonCancelacion;
    }
}
