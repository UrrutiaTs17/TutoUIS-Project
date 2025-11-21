package uis.edu.tutouis_project.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "usuario")
@Schema(description = "Modelo Usuario: representa un usuario del sistema")
public class Usuario {

    public static final String TABLE_NAME = "usuario";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    @Schema(description = "ID autogenerado del usuario", example = "1")
    private Integer id_usuario;

    @Column(name = "nombre")
    @Schema(description = "Nombre del usuario", example = "Juan")
    private String nombre;

    @Column(name = "apellido")
    @Schema(description = "Apellido del usuario", example = "Perez")
    private String apellido;

    @Column(name = "codigo", length = 10,  unique = true, nullable = false)
    @Schema(description = "Código único del usuario (login)", example = "jperez")
    private String codigo;

    @Column(name = "correo", unique = true, nullable = false)
    @Schema(description = "Correo electrónico", example = "juan@example.com")
    private String correo;

    @Column(name = "contrasena", nullable = false)
    @Schema(description = "Contraseña (no se retornará al solicitar perfil)", example = "miPassword123")
    private String contrasena;

    @Column(name = "telefono")
    @Schema(description = "Teléfono de contacto", example = "+573001112233")
    private String telefono;

    @Column(name = "id_rol", nullable = false)
    @Schema(description = "ID del rol del usuario (ej: 1=admin, 2=estudiante)", example = "2")
    private Integer id_rol;

    @Column(name = "id_carrera")
    @Schema(description = "ID de la carrera (opcional)", example = "3")
    private Integer id_carrera; // Puede ser null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrera", insertable = false, updatable = false)
    @JsonBackReference
    @Schema(description = "Carrera del usuario")
    private Carrera carrera;

    @Column(name = "activo")
    @Schema(description = "Si el usuario está activo", example = "true")
    private Boolean activo;

    @Column(name = "bloqueado")
    @Schema(description = "Si el usuario está bloqueado", example = "false")
    private Boolean bloqueado;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private java.sql.Timestamp fecha_creacion;

    @Column(name = "fecha_ultima_modificacion", insertable = false, updatable = false)
    private java.sql.Timestamp fecha_ultima_modificacion;

    @Column(name = "fecha_desbloqueo")
    private java.sql.Timestamp fecha_desbloqueo;

    // Getters y Setters
    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
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

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Integer getId_rol() {
        return id_rol;
    }

    public void setId_rol(Integer id_rol) {
        this.id_rol = id_rol;
    }

    public Integer getId_carrera() {
        return id_carrera;
    }

    public void setId_carrera(Integer id_carrera) {
        this.id_carrera = id_carrera;
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

    public java.sql.Timestamp getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(java.sql.Timestamp fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public java.sql.Timestamp getFecha_ultima_modificacion() {
        return fecha_ultima_modificacion;
    }

    public void setFecha_ultima_modificacion(java.sql.Timestamp fecha_ultima_modificacion) {
        this.fecha_ultima_modificacion = fecha_ultima_modificacion;
    }

    public java.sql.Timestamp getFecha_desbloqueo() {
        return fecha_desbloqueo;
    }

    public void setFecha_desbloqueo(java.sql.Timestamp fecha_desbloqueo) {
        this.fecha_desbloqueo = fecha_desbloqueo;
    }

    public Carrera getCarrera() {
        return carrera;
    }

    public void setCarrera(Carrera carrera) {
        this.carrera = carrera;
    }
}
