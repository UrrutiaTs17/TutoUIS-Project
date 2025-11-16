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
    @JsonBackReference
    @Schema(description = "Usuario tutor que ofrece la tutoría")
    private Usuario tutor;

    @Column(name = "id_carrera", nullable = false)
    @Schema(description = "ID de la carrera relacionada", example = "1")
    private Integer idCarrera;

    @Column(name = "nombre", length = 100, nullable = false)
    @Schema(description = "Nombre o tema de la tutoría", example = "Java Avanzado")
    private String nombre;

    @Column(name = "descripcion", length = 500)
    @Schema(description = "Descripción de la tutoría", example = "Tutoría sobre programación en Java")
    private String descripcion;

    @Column(name = "capacidad_maxima", nullable = false)
    @Schema(description = "Capacidad máxima de estudiantes", example = "30")
    private Integer capacidadMaxima;

    @Column(name = "ubicacion", length = 100)
    @Schema(description = "Ubicación de la tutoría", example = "Aula 101")
    private String ubicacion;

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

    public Tutoria(Integer idTutor, Integer idCarrera, String nombre, Integer capacidadMaxima) {
        this.idTutor = idTutor;
        this.idCarrera = idCarrera;
        this.nombre = nombre;
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

    public Integer getIdCarrera() {
        return idCarrera;
    }

    public void setIdCarrera(Integer idCarrera) {
        this.idCarrera = idCarrera;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
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
                ", idCarrera=" + idCarrera +
                ", nombre='" + nombre + '\'' +
                ", capacidadMaxima=" + capacidadMaxima +
                '}';
    }
}
