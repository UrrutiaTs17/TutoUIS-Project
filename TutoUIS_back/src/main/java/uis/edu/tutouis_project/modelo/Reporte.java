package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Entity
@Table(name = "reporte")
@Schema(description = "Modelo Reporte: reportes generados por administradores")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    @Schema(description = "ID autogenerado del reporte", example = "1")
    private Integer idReporte;

    @Column(name = "id_admin", nullable = false)
    @Schema(description = "ID del administrador que generó el reporte", example = "1")
    private Integer idAdmin;

    @Column(name = "tipo", length = 100, nullable = false)
    @Schema(description = "Tipo de reporte", example = "Asistencia")
    private String tipo;

    @Column(name = "titulo", length = 255, nullable = false)
    @Schema(description = "Título del reporte", example = "Reporte de Asistencia Semanal")
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "LONGTEXT")
    @Schema(description = "Contenido del reporte")
    private String descripcion;

    @Column(name = "fecha_generacion", insertable = false, updatable = false)
    @Schema(description = "Fecha de generación")
    private Timestamp fechaGeneracion;

    @Column(name = "filtros")
    @Schema(description = "Filtros aplicados en formato JSON")
    private String filtros;

    public Reporte() {
    }

    public Reporte(Integer idAdmin, String tipo, String titulo) {
        this.idAdmin = idAdmin;
        this.tipo = tipo;
        this.titulo = titulo;
    }

    public Integer getIdReporte() {
        return idReporte;
    }

    public void setIdReporte(Integer idReporte) {
        this.idReporte = idReporte;
    }

    public Integer getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Integer idAdmin) {
        this.idAdmin = idAdmin;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Timestamp getFechaGeneracion() {
        return fechaGeneracion;
    }

    public void setFechaGeneracion(Timestamp fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }

    public String getFiltros() {
        return filtros;
    }

    public void setFiltros(String filtros) {
        this.filtros = filtros;
    }

    @Override
    public String toString() {
        return "Reporte{" +
                "idReporte=" + idReporte +
                ", idAdmin=" + idAdmin +
                ", tipo='" + tipo + '\'' +
                ", titulo='" + titulo + '\'' +
                '}';
    }
}
