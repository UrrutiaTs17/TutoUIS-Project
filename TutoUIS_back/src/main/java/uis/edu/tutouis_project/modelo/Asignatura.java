package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "asignatura")
@Schema(description = "Modelo Asignatura: representa una asignatura o materia académica")
public class Asignatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignatura")
    @Schema(description = "ID autogenerado de la asignatura", example = "1")
    private Integer idAsignatura;

    @Column(name = "nombre", nullable = false, length = 200, unique = true)
    @Schema(description = "Nombre de la asignatura", example = "CALCULO I")
    private String nombre;

    @Column(name = "facultad", nullable = false, length = 200)
    @Schema(description = "Facultad a la que pertenece", example = "E3T")
    private String facultad;

    public Asignatura() {
    }

    public Asignatura(String nombre, String facultad) {
        this.nombre = nombre;
        this.facultad = facultad;
    }

    public Integer getIdAsignatura() {
        return idAsignatura;
    }

    public void setIdAsignatura(Integer idAsignatura) {
        this.idAsignatura = idAsignatura;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFacultad() {
        return facultad;
    }

    public void setFacultad(String facultad) {
        this.facultad = facultad;
    }

    @Override
    public String toString() {
        return "Asignatura{" +
                "idAsignatura=" + idAsignatura +
                ", nombre='" + nombre + '\'' +
                ", facultad='" + facultad + '\'' +
                '}';
    }
}
