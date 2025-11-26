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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;
import java.util.List;
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

    @Column(name = "lugar", length = 200)
    @Schema(description = "Lugar donde se realiza la tutoría", example = "Aula 101")
    private String lugar;

    @Column(name = "descripcion", length = 500)
    @Schema(description = "Descripción de la tutoría", example = "Tutoría sobre programación en Java")
    private String descripcion;

    @Column(name = "id_estado_tutoria")
    @Schema(description = "ID del estado del ciclo de vida de la tutoría", example = "2")
    private Integer idEstadoTutoria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estado_tutoria", insertable = false, updatable = false)
    @Schema(description = "Estado actual del ciclo de vida de la tutoría")
    private EstadoTutoria estadoTutoria;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de creación de la tutoría")
    private Timestamp fechaCreacion;

    @Column(name = "fecha_ultima_modificacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de última modificación")
    private Timestamp fechaUltimaModificacion;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tutoria", insertable = false, updatable = false)
    @Schema(description = "Lista de disponibilidades asociadas a la tutoría")
    private List<Disponibilidad> disponibilidades;

    public Tutoria() {
        this.idEstadoTutoria = 1; // Pendiente por defecto
    }

    public Tutoria(Integer idTutor, Integer idAsignatura, String lugar, String descripcion) {
        this.idTutor = idTutor;
        this.idAsignatura = idAsignatura;
        this.lugar = lugar;
        this.descripcion = descripcion;
        this.idEstadoTutoria = 1; // Pendiente por defecto
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

    public Integer getIdEstadoTutoria() {
        return idEstadoTutoria;
    }

    public void setIdEstadoTutoria(Integer idEstadoTutoria) {
        this.idEstadoTutoria = idEstadoTutoria;
    }

    public EstadoTutoria getEstadoTutoria() {
        return estadoTutoria;
    }

    public void setEstadoTutoria(EstadoTutoria estadoTutoria) {
        this.estadoTutoria = estadoTutoria;
    }

    public List<Disponibilidad> getDisponibilidades() {
        return disponibilidades;
    }

    public void setDisponibilidades(List<Disponibilidad> disponibilidades) {
        this.disponibilidades = disponibilidades;
    }

    @Override
    public String toString() {
        return "Tutoria{" +
                "idTutoria=" + idTutoria +
                ", idTutor=" + idTutor +
                ", idAsignatura=" + idAsignatura +
                ", lugar='" + lugar + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", idEstadoTutoria=" + idEstadoTutoria +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaUltimaModificacion=" + fechaUltimaModificacion +
                '}';
    }
}
