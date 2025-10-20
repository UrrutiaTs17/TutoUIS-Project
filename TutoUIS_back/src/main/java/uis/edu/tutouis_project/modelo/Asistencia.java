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
@Table(name = "asistencia")
@Schema(description = "Modelo Asistencia: registra la asistencia de estudiantes en tutorías")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    @Schema(description = "ID autogenerado de la asistencia", example = "1")
    private Integer idAsistencia;

    @Column(name = "id_reserva", nullable = false)
    @Schema(description = "ID de la reserva relacionada", example = "1")
    private Integer idReserva;

    @Column(name = "id_tutor", nullable = false)
    @Schema(description = "ID del tutor que registra", example = "5")
    private Integer idTutor;

    @Column(name = "id_estado", nullable = false)
    @Schema(description = "ID del estado de asistencia", example = "1")
    private Integer idEstado;

    @Column(name = "observaciones", length = 500)
    @Schema(description = "Observaciones sobre la asistencia")
    private String observaciones;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    @Schema(description = "Fecha de registro de la asistencia")
    private Timestamp fechaRegistro;

    @Column(name = "usuario_registro_id", nullable = false)
    @Schema(description = "ID del usuario que registra la asistencia", example = "5")
    private Integer usuarioRegistroId;

    public Asistencia() {
    }

    public Asistencia(Integer idReserva, Integer idTutor, Integer idEstado, Integer usuarioRegistroId) {
        this.idReserva = idReserva;
        this.idTutor = idTutor;
        this.idEstado = idEstado;
        this.usuarioRegistroId = usuarioRegistroId;
    }

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }

    public Integer getIdTutor() {
        return idTutor;
    }

    public void setIdTutor(Integer idTutor) {
        this.idTutor = idTutor;
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

    public Timestamp getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Timestamp fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Integer getUsuarioRegistroId() {
        return usuarioRegistroId;
    }

    public void setUsuarioRegistroId(Integer usuarioRegistroId) {
        this.usuarioRegistroId = usuarioRegistroId;
    }

    @Override
    public String toString() {
        return "Asistencia{" +
                "idAsistencia=" + idAsistencia +
                ", idReserva=" + idReserva +
                ", idTutor=" + idTutor +
                ", idEstado=" + idEstado +
                '}';
    }
}
