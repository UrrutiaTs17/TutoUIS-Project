package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Entity
@Table(name = "tutor")
@Schema(description = "Modelo Tutor: representa a un tutor del sistema")
public class Tutor {

    @Id
    @Column(name = "id_usuario")
    @Schema(description = "ID del usuario tutor", example = "5")
    private Integer idUsuario;

    @Column(name = "especialidad", length = 100)
    @Schema(description = "Especialidad o materia del tutor", example = "Programación Java")
    private String especialidad;

    @Column(name = "fecha_asignacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de asignación como tutor")
    private Timestamp fechaAsignacion;

    public Tutor() {
    }

    public Tutor(Integer idUsuario, String especialidad) {
        this.idUsuario = idUsuario;
        this.especialidad = especialidad;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public Timestamp getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(Timestamp fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    @Override
    public String toString() {
        return "Tutor{" +
                "idUsuario=" + idUsuario +
                ", especialidad='" + especialidad + '\'' +
                ", fechaAsignacion=" + fechaAsignacion +
                '}';
    }
}
