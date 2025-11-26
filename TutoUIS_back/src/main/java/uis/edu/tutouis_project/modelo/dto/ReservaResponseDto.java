package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;
import java.time.LocalTime;

@Schema(description = "DTO de respuesta para una reserva con información completa")
public class ReservaResponseDto {

    @Schema(description = "ID de la reserva", example = "1")
    private Integer idReserva;

    @Schema(description = "ID de la disponibilidad", example = "1")
    private Integer idDisponibilidad;

    @Schema(description = "Hora de inicio de la disponibilidad", example = "08:00:00")
    private LocalTime disponibilidadHoraInicio;

    @Schema(description = "Hora de fin de la disponibilidad", example = "10:00:00")
    private LocalTime disponibilidadHoraFin;

    @Schema(description = "ID del estudiante", example = "4")
    private Integer idEstudiante;

    @Schema(description = "Nombre completo del estudiante", example = "Juan Pérez")
    private String nombreEstudiante;

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

    @Schema(description = "Hora de inicio de la reserva", example = "08:00:00")
    private LocalTime horaInicio;

    @Schema(description = "Hora de fin de la reserva", example = "08:15:00")
    private LocalTime horaFin;

    @Schema(description = "Nombre de la asignatura", example = "Cálculo Diferencial")
    private String nombreAsignatura;

    @Schema(description = "Nombre del tutor", example = "Dr. Carlos Ramírez")
    private String nombreTutor;

    @Schema(description = "Modalidad de la tutoría", example = "Presencial")
    private String modalidad;

    @Schema(description = "Enlace de Google Meet (solo para modalidad Virtual)", example = "https://meet.google.com/xxx-yyyy-zzz")
    private String meetLink;

    public ReservaResponseDto() {
    }

    // Constructor simple (mantenido por compatibilidad)
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
    
    // Constructor completo para optimización con JOINs
    public ReservaResponseDto(
            Integer idReserva,
            Integer idDisponibilidad,
            LocalTime disponibilidadHoraInicio,
            LocalTime disponibilidadHoraFin,
            Integer idEstudiante,
            String nombreEstudiante,
            Integer idEstado,
            String nombreEstado,
            String observaciones,
            Timestamp fechaCreacion,
            Timestamp fechaCancelacion,
            String razonCancelacion,
            LocalTime horaInicio,
            LocalTime horaFin,
            String nombreAsignatura,
            String nombreTutor) {
        this.idReserva = idReserva;
        this.idDisponibilidad = idDisponibilidad;
        this.disponibilidadHoraInicio = disponibilidadHoraInicio;
        this.disponibilidadHoraFin = disponibilidadHoraFin;
        this.idEstudiante = idEstudiante;
        this.nombreEstudiante = nombreEstudiante;
        this.idEstado = idEstado;
        this.nombreEstado = nombreEstado;
        this.observaciones = observaciones;
        this.fechaCreacion = fechaCreacion;
        this.fechaCancelacion = fechaCancelacion;
        this.razonCancelacion = razonCancelacion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.nombreAsignatura = nombreAsignatura;
        this.nombreTutor = nombreTutor;
    }

    // Constructor extendido (incluye modalidad y meetLink)
    public ReservaResponseDto(
            Integer idReserva,
            Integer idDisponibilidad,
            LocalTime disponibilidadHoraInicio,
            LocalTime disponibilidadHoraFin,
            Integer idEstudiante,
            String nombreEstudiante,
            Integer idEstado,
            String nombreEstado,
            String observaciones,
            Timestamp fechaCreacion,
            Timestamp fechaCancelacion,
            String razonCancelacion,
            LocalTime horaInicio,
            LocalTime horaFin,
            String nombreAsignatura,
            String nombreTutor,
            String modalidad,
            String meetLink) {
        this(idReserva, idDisponibilidad, disponibilidadHoraInicio, disponibilidadHoraFin, idEstudiante,
             nombreEstudiante, idEstado, nombreEstado, observaciones, fechaCreacion, fechaCancelacion,
             razonCancelacion, horaInicio, horaFin, nombreAsignatura, nombreTutor);
        this.modalidad = modalidad;
        this.meetLink = meetLink;
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

    public LocalTime getDisponibilidadHoraInicio() {
        return disponibilidadHoraInicio;
    }

    public void setDisponibilidadHoraInicio(LocalTime disponibilidadHoraInicio) {
        this.disponibilidadHoraInicio = disponibilidadHoraInicio;
    }

    public LocalTime getDisponibilidadHoraFin() {
        return disponibilidadHoraFin;
    }

    public void setDisponibilidadHoraFin(LocalTime disponibilidadHoraFin) {
        this.disponibilidadHoraFin = disponibilidadHoraFin;
    }

    public Integer getIdEstudiante() {
        return idEstudiante;
    }

    public void setIdEstudiante(Integer idEstudiante) {
        this.idEstudiante = idEstudiante;
    }

    public String getNombreEstudiante() {
        return nombreEstudiante;
    }

    public void setNombreEstudiante(String nombreEstudiante) {
        this.nombreEstudiante = nombreEstudiante;
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

    public String getNombreAsignatura() {
        return nombreAsignatura;
    }

    public void setNombreAsignatura(String nombreAsignatura) {
        this.nombreAsignatura = nombreAsignatura;
    }

    public String getNombreTutor() {
        return nombreTutor;
    }

    public void setNombreTutor(String nombreTutor) {
        this.nombreTutor = nombreTutor;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getMeetLink() {
        return meetLink;
    }

    public void setMeetLink(String meetLink) {
        this.meetLink = meetLink;
    }
}
