package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "carrera")
@Schema(description = "Modelo Carrera: representa las carreras académicas")
public class Carrera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrera")
    @Schema(description = "ID autogenerado de la carrera", example = "1")
    private Integer idCarrera;

    @Column(name = "nombre", length = 100, nullable = false, unique = true)
    @Schema(description = "Nombre de la carrera", example = "Ingeniería de Sistemas")
    private String nombre;

    @Column(name = "descripcion", length = 255)
    @Schema(description = "Descripción de la carrera", example = "Carrera de pregrado en Ingeniería")
    private String descripcion;

    @Column(name = "codigo", length = 50, unique = true)
    @Schema(description = "Código de la carrera", example = "ING001")
    private String codigo;

    public Carrera() {
    }

    public Carrera(String nombre, String descripcion, String codigo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
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

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @Override
    public String toString() {
        return "Carrera{" +
                "idCarrera=" + idCarrera +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", codigo='" + codigo + '\'' +
                '}';
    }
}
