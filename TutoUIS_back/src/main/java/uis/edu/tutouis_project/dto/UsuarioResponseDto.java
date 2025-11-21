package uis.edu.tutouis_project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Schema(description = "DTO de respuesta con información completa del usuario")
public class UsuarioResponseDto {
    
    @Schema(description = "ID del usuario", example = "1")
    private Integer idUsuario;
    
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String nombre;
    
    @Schema(description = "Apellido del usuario", example = "Pérez")
    private String apellido;
    
    @Schema(description = "Código único del usuario", example = "777")
    private String codigo;
    
    @Schema(description = "Correo electrónico", example = "juan@example.com")
    private String correo;
    
    @Schema(description = "Teléfono de contacto", example = "+573001112233")
    private String telefono;
    
    @Schema(description = "ID del rol", example = "2")
    private Integer idRol;
    
    @Schema(description = "Nombre del rol", example = "Estudiante")
    private String nombreRol;
    
    @Schema(description = "ID de la carrera", example = "3")
    private Integer idCarrera;
    
    @Schema(description = "Nombre de la carrera", example = "Ingeniería de Sistemas")
    private String nombreCarrera;
    
    @Schema(description = "Usuario activo", example = "true")
    private Boolean activo;
    
    @Schema(description = "Usuario bloqueado", example = "false")
    private Boolean bloqueado;
    
    @Schema(description = "Fecha de creación")
    private Timestamp fechaCreacion;
    
    @Schema(description = "Fecha de última modificación")
    private Timestamp fechaUltimaModificacion;
    
    @Schema(description = "Fecha de desbloqueo")
    private Timestamp fechaDesbloqueo;
    
    // Constructor vacío
    public UsuarioResponseDto() {
    }
    
    // Constructor completo para query optimizado
    public UsuarioResponseDto(
            Integer idUsuario,
            String nombre,
            String apellido,
            String codigo,
            String correo,
            String telefono,
            Integer idRol,
            String nombreRol,
            Integer idCarrera,
            String nombreCarrera,
            Boolean activo,
            Boolean bloqueado,
            Timestamp fechaCreacion,
            Timestamp fechaUltimaModificacion,
            Timestamp fechaDesbloqueo) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.codigo = codigo;
        this.correo = correo;
        this.telefono = telefono;
        this.idRol = idRol;
        this.nombreRol = nombreRol;
        this.idCarrera = idCarrera;
        this.nombreCarrera = nombreCarrera;
        this.activo = activo;
        this.bloqueado = bloqueado;
        this.fechaCreacion = fechaCreacion;
        this.fechaUltimaModificacion = fechaUltimaModificacion;
        this.fechaDesbloqueo = fechaDesbloqueo;
    }
    
    // Getters y Setters
    public Integer getIdUsuario() {
        return idUsuario;
    }
    
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public Integer getIdRol() {
        return idRol;
    }
    
    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }
    
    public String getNombreRol() {
        return nombreRol;
    }
    
    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
    
    public Integer getIdCarrera() {
        return idCarrera;
    }
    
    public void setIdCarrera(Integer idCarrera) {
        this.idCarrera = idCarrera;
    }
    
    public String getNombreCarrera() {
        return nombreCarrera;
    }
    
    public void setNombreCarrera(String nombreCarrera) {
        this.nombreCarrera = nombreCarrera;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public Boolean getBloqueado() {
        return bloqueado;
    }
    
    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
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
    
    public Timestamp getFechaDesbloqueo() {
        return fechaDesbloqueo;
    }
    
    public void setFechaDesbloqueo(Timestamp fechaDesbloqueo) {
        this.fechaDesbloqueo = fechaDesbloqueo;
    }
}
