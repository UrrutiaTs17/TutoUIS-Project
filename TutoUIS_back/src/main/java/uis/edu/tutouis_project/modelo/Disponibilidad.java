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
import java.sql.Time;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonBackReference;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tutoria", insertable = false, updatable = false)
    @JsonBackReference
    @Schema(description = "Tutoría relacionada")
    private Tutoria tutoria;

    @Column(name = "dia_semana", nullable = false, length = 10)
    @Schema(description = "Día de la semana", example = "Lunes")
    private String diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    @Schema(description = "Hora de inicio", example = "09:00:00")
    private Time horaInicio;

    @Column(name = "hora_fin", nullable = false)
    @Schema(description = "Hora de fin", example = "10:00:00")
    private Time horaFin;

    @Column(name = "aforo_maximo", nullable = false)
    @Schema(description = "Capacidad máxima de la sesión", example = "30")
    private Integer aforoMaximo;

    @Column(name = "aforo_disponible", nullable = false)
    @Schema(description = "Lugares disponibles en la sesión", example = "25")
    private Integer aforoDisponible;

    @Column(name = "id_estado", nullable = false)
    @Schema(description = "ID del estado (1=Activa, 2=Inactiva, 3=Cancelada)", example = "1")
    private Integer idEstado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estado", insertable = false, updatable = false)
    @Schema(description = "Estado de la disponibilidad")
    private EstadoDisponibilidad estadoDisponibilidad;

    @Column(name = "razon_cancelacion", length = 500)
    @Schema(description = "Motivo de cancelación si aplica", example = "Enfermedad del tutor")
    private String razonCancelacion;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación")
    private Timestamp fechaCreacion;

    public Disponibilidad() {
    }

    public Disponibilidad(Integer idTutoria, String diaSemana, Time horaInicio, Time horaFin, Integer aforoMaximo) {
        this.idTutoria = idTutoria;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.aforoMaximo = aforoMaximo;
        this.aforoDisponible = aforoMaximo;
        this.idEstado = 1;
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

    public Tutoria getTutoria() {
        return tutoria;
    }

    public void setTutoria(Tutoria tutoria) {
        this.tutoria = tutoria;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
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

    public Integer getAforoMaximo() {
        return aforoMaximo;
    }

    public void setAforoMaximo(Integer aforoMaximo) {
        this.aforoMaximo = aforoMaximo;
    }

    public Integer getAforoDisponible() {
        return aforoDisponible;
    }

    public void setAforoDisponible(Integer aforoDisponible) {
        this.aforoDisponible = aforoDisponible;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
    }

    public EstadoDisponibilidad getEstadoDisponibilidad() {
        return estadoDisponibilidad;
    }

    public void setEstadoDisponibilidad(EstadoDisponibilidad estadoDisponibilidad) {
        this.estadoDisponibilidad = estadoDisponibilidad;
    }

    public String getRazonCancelacion() {
        return razonCancelacion;
    }

    public void setRazonCancelacion(String razonCancelacion) {
        this.razonCancelacion = razonCancelacion;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    @Override
    public String toString() {
        return "Disponibilidad{" +
                "idDisponibilidad=" + idDisponibilidad +
                ", idTutoria=" + idTutoria +
                ", diaSemana='" + diaSemana + '\'' +
                ", horaInicio=" + horaInicio +
                ", horaFin=" + horaFin +
                ", aforoMaximo=" + aforoMaximo +
                ", aforoDisponible=" + aforoDisponible +
                ", idEstado=" + idEstado +
                '}';
    }
}
