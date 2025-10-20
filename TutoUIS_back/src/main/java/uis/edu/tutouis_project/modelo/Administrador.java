package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Entity
@Table(name = "administrador")
@Schema(description = "Modelo Administrador: representa a un administrador del sistema")
public class Administrador {

    @Id
    @Column(name = "id_usuario")
    @Schema(description = "ID del usuario administrador", example = "1")
    private Integer idUsuario;

    @Column(name = "fecha_asignacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de asignación como administrador")
    private Timestamp fechaAsignacion;

    public Administrador() {
    }

    public Administrador(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Timestamp getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(Timestamp fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    @Override
    public String toString() {
        return "Administrador{" +
                "idUsuario=" + idUsuario +
                ", fechaAsignacion=" + fechaAsignacion +
                '}';
    }
}
