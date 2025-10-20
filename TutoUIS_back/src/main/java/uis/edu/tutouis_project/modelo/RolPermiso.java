package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "rol_permiso")
@Schema(description = "Modelo RolPermiso: asocia roles con permisos")
public class RolPermiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_permiso")
    @Schema(description = "ID autogenerado de la asociación", example = "1")
    private Integer idRolPermiso;

    @Column(name = "id_rol", nullable = false)
    @Schema(description = "ID del rol", example = "1")
    private Integer idRol;

    @Column(name = "id_permiso", nullable = false)
    @Schema(description = "ID del permiso", example = "1")
    private Integer idPermiso;

    public RolPermiso() {
    }

    public RolPermiso(Integer idRol, Integer idPermiso) {
        this.idRol = idRol;
        this.idPermiso = idPermiso;
    }

    public Integer getIdRolPermiso() {
        return idRolPermiso;
    }

    public void setIdRolPermiso(Integer idRolPermiso) {
        this.idRolPermiso = idRolPermiso;
    }

    public Integer getIdRol() {
        return idRol;
    }

    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public Integer getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Integer idPermiso) {
        this.idPermiso = idPermiso;
    }

    @Override
    public String toString() {
        return "RolPermiso{" +
                "idRolPermiso=" + idRolPermiso +
                ", idRol=" + idRol +
                ", idPermiso=" + idPermiso +
                '}';
    }
}
