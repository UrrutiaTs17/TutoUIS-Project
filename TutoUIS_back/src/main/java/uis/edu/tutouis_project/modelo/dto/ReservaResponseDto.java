package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Schema(description = "DTO de respuesta para una reserva con información completa")
public class ReservaResponseDto {

    @Schema(description = "ID de la reserva", example = "1")
    private Integer idReserva;

    @Schema(description = "ID de la disponibilidad", example = "1")
    private Integer idDisponibilidad;

    @Schema(description = "ID del estudiante", example = "4")
    private Integer idEstudiante;

    @Schema(description = "ID del estado", example = "1")
    private Integer idEstado;

    @Schema(description = "Nombre del estado", example = "Reservada")
    private String nombreEstado;

    @Schema(description = "Observaciones", example = "Necesito reforzar en Java")
    private String observaciones;

    @Schema(description = "Fecha de creación", example = "2025-11-07T10:30:00")
    private Timestamp fechaCreacion;

    @Schema(description = "Fecha de cancelación si aplica")
    private Timestamp fechaCancelacion;

    @Schema(description = "Razón de cancelación si aplica")
    private String razonCancelacion;

    public ReservaResponseDto() {
    }

    public ReservaResponseDto(Integer idReserva, Integer idDisponibilidad, Integer idEstudiante, 
                              Integer idEstado, String nombreEstado, String observaciones, 
                              Timestamp fechaCreacion) {
        this.idReserva = idReserva;
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
        this.idEstado = idEstado;
        this.nombreEstado = nombreEstado;
        this.observaciones = observaciones;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters and Setters
    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
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

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }

    public String getNombreEstado() {
        return nombreEstado;
    }

    public void setNombreEstado(String nombreEstado) {
        this.nombreEstado = nombreEstado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaCancelacion() {
        return fechaCancelacion;
    }

    public void setFechaCancelacion(Timestamp fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }

    public String getRazonCancelacion() {
        return razonCancelacion;
    }

    public void setRazonCancelacion(String razonCancelacion) {
        this.razonCancelacion = razonCancelacion;
    }
}
