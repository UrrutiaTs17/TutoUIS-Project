package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "estado_disponibilidad")
@Schema(description = "Modelo EstadoDisponibilidad: estados posibles de una disponibilidad")
public class EstadoDisponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    @Schema(description = "ID autogenerado del estado", example = "1")
    private Integer idEstado;

    @Column(name = "nombre", length = 50, nullable = false, unique = true)
    @Schema(description = "Nombre del estado", example = "Activa")
    private String nombre;

    @Column(name = "descripcion", length = 200)
    @Schema(description = "Descripción del estado", example = "Disponibilidad activa y abierta para reservas")
    private String descripcion;

    public EstadoDisponibilidad() {
    }

    public EstadoDisponibilidad(String nombre, String descripcion) {
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
        return "EstadoDisponibilidad{" +
                "idEstado=" + idEstado +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                '}';
    }
}
