package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

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

    @Column(name = "id_estudiante", nullable = false)
    @Schema(description = "ID del estudiante que hace la reserva", example = "4")
    private Integer idEstudiante;

    @Column(name = "id_estado", nullable = false)
    @Schema(description = "ID del estado de la reserva", example = "1")
    private Integer idEstado;

    @Column(name = "observaciones", length = 500)
    @Schema(description = "Observaciones sobre la reserva")
    private String observaciones;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación de la reserva")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_cancelacion")
    @Schema(description = "Fecha de cancelación si aplica")
    private Timestamp fechaCancelacion;

    @Column(name = "razon_cancelacion", length = 500)
    @Schema(description = "Motivo de cancelación si aplica")
    private String razonCancelacion;

    public Reserva() {
    }

    public Reserva(Integer idDisponibilidad, Integer idEstudiante) {
        this.idDisponibilidad = idDisponibilidad;
        this.idEstudiante = idEstudiante;
        this.idEstado = 1;
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

    @Override
    public String toString() {
        return "Reserva{" +
                "idReserva=" + idReserva +
                ", idDisponibilidad=" + idDisponibilidad +
                ", idEstudiante=" + idEstudiante +
                ", idEstado=" + idEstado +
                '}';
    }
}
