package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "permiso")
@Schema(description = "Modelo Permiso: define los permisos del sistema")
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    @Schema(description = "ID autogenerado del permiso", example = "1")
    private Integer idPermiso;

    @Column(name = "nombre", length = 100, nullable = false, unique = true)
    @Schema(description = "Nombre del permiso", example = "crear_usuario")
    private String nombre;

    @Column(name = "descripcion", length = 255)
    @Schema(description = "Descripción del permiso", example = "Crear nuevos usuarios")
    private String descripcion;

    @Column(name = "modulo", length = 100)
    @Schema(description = "Módulo al que pertenece", example = "usuarios")
    private String modulo;

    public Permiso() {
    }

    public Permiso(String nombre, String descripcion, String modulo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.modulo = modulo;
    }

    public Integer getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Integer idPermiso) {
        this.idPermiso = idPermiso;
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

    public String getModulo() {
        return modulo;
    }

    public void setModulo(String modulo) {
        this.modulo = modulo;
    }

    @Override
    public String toString() {
        return "Permiso{" +
                "idPermiso=" + idPermiso +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", modulo='" + modulo + '\'' +
                '}';
    }
}
