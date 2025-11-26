package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "reserva")
@Schema(description = "Modelo Reserva: representa una reserva de un estudiante en una tutoría")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    @Schema(description = "ID autogenerado de la reserva", example = "1")
    private Integer idReserva;

    @Column(name = "id_disponibilidad", nullable = false)
    @Schema(description = "ID de la disponibilidad reservada", example = "1")
    private Integer idDisponibilidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_disponibilidad", insertable = false, updatable = false)
    @JsonBackReference
    @Schema(description = "Disponibilidad relacionada")
    private Disponibilidad disponibilidad;

    @Column(name = "id_estudiante", nullable = false)
    @Schema(description = "ID del estudiante que hace la reserva", example = "4")
    private Integer idEstudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estudiante", insertable = false, updatable = false)
    @JsonBackReference
    @Schema(description = "Estudiante que realiza la reserva")
    private Usuario estudiante;

    @Column(name = "id_estado", nullable = false)
    @Schema(description = "ID del estado de la reserva", example = "1")
    private Integer idEstado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estado", insertable = false, updatable = false)
    @Schema(description = "Estado de la reserva")
    private EstadoReserva estadoReserva;

    @Column(name = "observaciones", length = 500)
    @Schema(description = "Observaciones sobre la reserva")
    private String observaciones;

    @Column(name = "fecha_creacion", updatable = false)
    @Schema(description = "Fecha de creación de la reserva")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_cancelacion")
    @Schema(description = "Fecha de cancelación si aplica")
    private Timestamp fechaCancelacion;

    @Column(name = "razon_cancelacion", length = 500)
    @Schema(description = "Motivo de cancelación si aplica")
    private String razonCancelacion;

    @Column(name = "hora_inicio", nullable = false)
    @NotNull(message = "La hora de inicio es obligatoria")
    @Schema(description = "Hora de inicio de la reserva (sesión de 15 minutos)", example = "08:00:00")
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    @NotNull(message = "La hora de fin es obligatoria")
    @Schema(description = "Hora de fin de la reserva (sesión de 15 minutos)", example = "08:15:00")
    private LocalTime horaFin;

    @Column(name = "modalidad", nullable = false, length = 100)
    @NotNull(message = "La modalidad es obligatoria")
    @Schema(description = "Modalidad de la tutoría (Presencial o Virtual)", example = "Presencial")
    private String modalidad;

    @Column(name = "meet_link", length = 500)
    @Schema(description = "Enlace de Google Meet (solo para modalidad Virtual)", example = "https://meet.google.com/xxx-yyyy-zzz")
    private String meetLink;

    @Column(name = "google_event_id", length = 255)
    @Schema(description = "ID del evento en Google Calendar", example = "abc123xyz")
    private String googleEventId;

    public Reserva() {
    }

    public Reserva(Integer idDisponibilidad, Integer idEstudiante) {
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
        this.idEstado = 1;
    }

    public Reserva(Integer idDisponibilidad, Integer idEstudiante, LocalTime horaInicio, LocalTime horaFin) {
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
        this.idEstado = 1;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

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

    public Disponibilidad getDisponibilidad() {
        return disponibilidad;
    }

    public void setDisponibilidad(Disponibilidad disponibilidad) {
        this.disponibilidad = disponibilidad;
    }

    public Usuario getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Usuario estudiante) {
        this.estudiante = estudiante;
    }

    public EstadoReserva getEstadoReserva() {
        return estadoReserva;
    }

    public void setEstadoReserva(EstadoReserva estadoReserva) {
        this.estadoReserva = estadoReserva;
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

    public String getMeetLink() {
        return meetLink;
    }

    public void setMeetLink(String meetLink) {
        this.meetLink = meetLink;
    }

    public String getGoogleEventId() {
        return googleEventId;
    }

    public void setGoogleEventId(String googleEventId) {
        this.googleEventId = googleEventId;
    }

    @Override
    public String toString() {
        return "Reserva{" +
                "idReserva=" + idReserva +
                ", idDisponibilidad=" + idDisponibilidad +
                ", idEstudiante=" + idEstudiante +
                ", idEstado=" + idEstado +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                ", modalidad='" + modalidad + '\'' +
                '}';
    }
}
