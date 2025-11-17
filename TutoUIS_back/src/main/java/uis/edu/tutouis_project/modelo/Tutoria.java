package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "tutoria")
@Schema(description = "Modelo Tutoria: representa una tutoría ofrecida por un tutor")
public class Tutoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tutoria")
    @Schema(description = "ID autogenerado de la tutoría", example = "1")
    private Integer idTutoria;

    @Column(name = "id_tutor", nullable = false)
    @Schema(description = "ID del tutor que ofrece la tutoría", example = "5")
    private Integer idTutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tutor", insertable = false, updatable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonBackReference("tutor-tutoria")
    @Schema(description = "Usuario tutor que ofrece la tutoría")
    private Usuario tutor;

    @Column(name = "id_asignatura")
    @Schema(description = "ID de la asignatura relacionada", example = "1")
    private Integer idAsignatura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura", insertable = false, updatable = false)
    @JsonBackReference("asignatura-tutoria")
    @Schema(description = "Asignatura relacionada con la tutoría")
    private Asignatura asignatura;

    @Column(name = "modalidad", length = 50)
    @Schema(description = "Modalidad de la tutoría", example = "Presencial")
    private String modalidad;

    @Column(name = "lugar", length = 200)
    @Schema(description = "Lugar donde se realiza la tutoría", example = "Aula 101")
    private String lugar;

    @Column(name = "descripcion", length = 500)
    @Schema(description = "Descripción de la tutoría", example = "Tutoría sobre programación en Java")
    private String descripcion;

    @Column(name = "capacidad_maxima", nullable = false)
    @Schema(description = "Capacidad máxima de estudiantes", example = "30")
    private Integer capacidadMaxima;

    @Column(name = "estado", nullable = false)
    @Schema(description = "Estado de la tutoría (1=Activa, 0=Inactiva)", example = "1")
    private Integer estado;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación de la tutoría")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_ultima_modificacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de última modificación")
    private Timestamp fechaUltimaModificacion;

    public Tutoria() {
    }

    public Tutoria(Integer idTutor, Integer idAsignatura, String modalidad, String lugar, String descripcion, Integer capacidadMaxima) {
        this.idTutor = idTutor;
        this.idAsignatura = idAsignatura;
        this.modalidad = modalidad;
        this.lugar = lugar;
        this.descripcion = descripcion;
        this.capacidadMaxima = capacidadMaxima;
        this.estado = 1;
    }

    public Integer getIdTutoria() {
        return idTutoria;
    }

    public void setIdTutoria(Integer idTutoria) {
        this.idTutoria = idTutoria;
    }

    public Integer getIdTutor() {
        return idTutor;
    }

    public void setIdTutor(Integer idTutor) {
        this.idTutor = idTutor;
    }

    public Integer getIdAsignatura() {
        return idAsignatura;
    }

    public void setIdAsignatura(Integer idAsignatura) {
        this.idAsignatura = idAsignatura;
    }

    public Asignatura getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(Asignatura asignatura) {
        this.asignatura = asignatura;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }

    public void setCapacidadMaxima(Integer capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaUltimaModificacion() {
        return fechaUltimaModificacion;
    }

    public void setFechaUltimaModificacion(Timestamp fechaUltimaModificacion) {
        this.fechaUltimaModificacion = fechaUltimaModificacion;
    }

    public Usuario getTutor() {
        return tutor;
    }

    public void setTutor(Usuario tutor) {
        this.tutor = tutor;
    }

    @Override
    public String toString() {
        return "Tutoria{" +
                "idTutoria=" + idTutoria +
                ", idTutor=" + idTutor +
                ", idAsignatura=" + idAsignatura +
                ", modalidad='" + modalidad + '\'' +
                ", lugar='" + lugar + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", capacidadMaxima=" + capacidadMaxima +
                ", estado=" + estado +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaUltimaModificacion=" + fechaUltimaModificacion +
                '}';
    }
}
