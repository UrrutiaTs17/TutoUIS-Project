package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "disponibilidad")
@Schema(description = "Modelo Disponibilidad: representa la disponibilidad horaria de una tutoría")
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_disponibilidad")
    @Schema(description = "ID autogenerado de la disponibilidad", example = "1")
    private Integer idDisponibilidad;

    @Column(name = "id_tutoria", nullable = false)
    @Schema(description = "ID de la tutoría", example = "1")
    private Integer idTutoria;

    @Column(name = "fecha", nullable = false)
    @Schema(description = "Fecha de la disponibilidad", example = "2025-11-15")
    private Date fecha;

    @Column(name = "hora_inicio", nullable = false)
    @Schema(description = "Hora de inicio", example = "09:00:00")
    private Time horaInicio;

    @Column(name = "hora_fin", nullable = false)
    @Schema(description = "Hora de fin", example = "10:00:00")
    private Time horaFin;

    @Column(name = "aforo", nullable = false)
    @Schema(description = "Capacidad total de la sesión", example = "30")
    private Integer aforo;

    @Column(name = "aforo_disponible", nullable = false)
    @Schema(description = "Lugares disponibles en la sesión", example = "25")
    private Integer aforoDisponible;

    @Column(name = "estado", nullable = false)
    @Schema(description = "ID del estado (1=Activa, 2=Inactiva, 3=Cancelada)", example = "1")
    private Integer estado;

    @Column(name = "razon_cancelacion", length = 500)
    @Schema(description = "Motivo de cancelación si aplica", example = "Enfermedad del tutor")
    private String razonCancelacion;

    public Disponibilidad() {
    }

    public Disponibilidad(Integer idTutoria, Date fecha, Time horaInicio, Time horaFin, Integer aforo) {
        this.idTutoria = idTutoria;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.aforo = aforo;
        this.aforoDisponible = aforo;
        this.estado = 1;
    }

    public Integer getIdDisponibilidad() {
        return idDisponibilidad;
    }

    public void setIdDisponibilidad(Integer idDisponibilidad) {
        this.idDisponibilidad = idDisponibilidad;
    }

    public Integer getIdTutoria() {
        return idTutoria;
    }

    public void setIdTutoria(Integer idTutoria) {
        this.idTutoria = idTutoria;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Time getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(Time horaInicio) {
        this.horaInicio = horaInicio;
    }

    public Time getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(Time horaFin) {
        this.horaFin = horaFin;
    }

    public Integer getAforo() {
        return aforo;
    }

    public void setAforo(Integer aforo) {
        this.aforo = aforo;
    }

    public Integer getAforoDisponible() {
        return aforoDisponible;
    }

    public void setAforoDisponible(Integer aforoDisponible) {
        this.aforoDisponible = aforoDisponible;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getRazonCancelacion() {
        return razonCancelacion;
    }

    public void setRazonCancelacion(String razonCancelacion) {
        this.razonCancelacion = razonCancelacion;
    }

    @Override
    public String toString() {
        return "Disponibilidad{" +
                "idDisponibilidad=" + idDisponibilidad +
                ", idTutoria=" + idTutoria +
                ", fecha=" + fecha +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                '}';
    }
}
