package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "estado_tutoria")
@Schema(description = "Modelo EstadoTutoria: estados posibles del ciclo de vida de una tutoría")
public class EstadoTutoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    @Schema(description = "ID autogenerado del estado", example = "1")
    private Integer idEstado;

    @Column(name = "nombre", length = 50, nullable = false, unique = true)
    @Schema(description = "Nombre del estado", example = "Programada")
    private String nombre;

    @Column(name = "descripcion", length = 200)
    @Schema(description = "Descripción del estado", example = "Tutoría con disponibilidades programadas")
    private String descripcion;

    public EstadoTutoria() {
    }

    public EstadoTutoria(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Integer getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Integer idEstado) {
        this.idEstado = idEstado;
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

    @Override
    public String toString() {
        return "EstadoTutoria{" +
                "idEstado=" + idEstado +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                '}';
    }
}
