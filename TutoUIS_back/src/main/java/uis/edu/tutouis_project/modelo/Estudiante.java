package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Entity
@Table(name = "estudiante")
@Schema(description = "Modelo Estudiante: representa a un estudiante del sistema")
public class Estudiante {

    @Id
    @Column(name = "id_usuario")
    @Schema(description = "ID del usuario estudiante", example = "4")
    private Integer idUsuario;

    @Column(name = "codigo_estudiantil", length = 255, unique = true)
    @Schema(description = "Código estudiantil único", example = "2220058")
    private String codigoEstudiantil;

    @Column(name = "fecha_asignacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de asignación como estudiante")
    private Timestamp fechaAsignacion;

    public Estudiante() {
    }

    public Estudiante(Integer idUsuario, String codigoEstudiantil) {
        this.idUsuario = idUsuario;
        this.codigoEstudiantil = codigoEstudiantil;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getCodigoEstudiantil() {
        return codigoEstudiantil;
    }

    public void setCodigoEstudiantil(String codigoEstudiantil) {
        this.codigoEstudiantil = codigoEstudiantil;
    }

    public Timestamp getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(Timestamp fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    @Override
    public String toString() {
        return "Estudiante{" +
                "idUsuario=" + idUsuario +
                ", codigoEstudiantil='" + codigoEstudiantil + '\'' +
                ", fechaAsignacion=" + fechaAsignacion +
                '}';
    }
}
