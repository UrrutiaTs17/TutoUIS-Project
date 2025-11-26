package uis.edu.tutouis_project.modelo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de Usuario con información del Rol incluida")
public class UsuarioConRolDto {
    
    private Integer id_usuario;
    private String nombre;
    private String apellido;
    private String codigo;
    private String correo;
    private String telefono;
    private Integer id_rol;
    private String nombreRol; // Nombre del rol
    private Integer id_carrera;
    private Boolean activo;
    private Boolean bloqueado;
    private java.sql.Timestamp fecha_creacion;
    private java.sql.Timestamp fecha_ultima_modificacion;

    // Constructores
    public UsuarioConRolDto() {
    }

    public UsuarioConRolDto(Integer id_usuario, String nombre, String apellido, String codigo, 
                           String correo, String telefono, Integer id_rol, String nombreRol,
                           Integer id_carrera, Boolean activo, Boolean bloqueado,
                           java.sql.Timestamp fecha_creacion, java.sql.Timestamp fecha_ultima_modificacion) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.codigo = codigo;
        this.correo = correo;
        this.telefono = telefono;
        this.id_rol = id_rol;
        this.nombreRol = nombreRol;
        this.id_carrera = id_carrera;
        this.activo = activo;
        this.bloqueado = bloqueado;
        this.fecha_creacion = fecha_creacion;
        this.fecha_ultima_modificacion = fecha_ultima_modificacion;
    }

    // Getters y Setters
    public Integer getId_usuario() { return id_usuario; }
    public void setId_usuario(Integer id_usuario) { this.id_usuario = id_usuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Integer getId_rol() { return id_rol; }
    public void setId_rol(Integer id_rol) { this.id_rol = id_rol; }

    public String getNombreRol() { return nombreRol; }
    public void setNombreRol(String nombreRol) { this.nombreRol = nombreRol; }

    public Integer getId_carrera() { return id_carrera; }
    public void setId_carrera(Integer id_carrera) { this.id_carrera = id_carrera; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getBloqueado() { return bloqueado; }
    public void setBloqueado(Boolean bloqueado) { this.bloqueado = bloqueado; }

    public java.sql.Timestamp getFecha_creacion() { return fecha_creacion; }
    public void setFecha_creacion(java.sql.Timestamp fecha_creacion) { this.fecha_creacion = fecha_creacion; }

    public java.sql.Timestamp getFecha_ultima_modificacion() { return fecha_ultima_modificacion; }
    public void setFecha_ultima_modificacion(java.sql.Timestamp fecha_ultima_modificacion) { 
        this.fecha_ultima_modificacion = fecha_ultima_modificacion; 
    }
}
