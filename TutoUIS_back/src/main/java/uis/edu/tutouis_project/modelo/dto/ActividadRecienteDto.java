package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Schema(description = "DTO para actividad reciente del sistema")
public class ActividadRecienteDto {
    
    private String tipo; // "USUARIO", "TUTORIA", "RESERVA"
    private String descripcion;
    private String usuario; // Nombre del usuario relacionado
    private Timestamp fecha;
    private String icono; // Icono Bootstrap para el frontend
    private String badge; // Color del badge: success, info, warning, danger
    
    public ActividadRecienteDto() {
    }
    
    public ActividadRecienteDto(String tipo, String descripcion, String usuario, Timestamp fecha, String icono, String badge) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.usuario = usuario;
        this.fecha = fecha;
        this.icono = icono;
        this.badge = badge;
    }

    // Getters y Setters
    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }
}
