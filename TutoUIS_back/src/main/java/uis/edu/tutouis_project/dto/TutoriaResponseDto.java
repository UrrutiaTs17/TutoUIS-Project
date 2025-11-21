package uis.edu.tutouis_project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Timestamp;

@Schema(description = "DTO de respuesta con información completa de la tutoría")
public class TutoriaResponseDto {
    
    @Schema(description = "ID de la tutoría", example = "1")
    private Integer idTutoria;
    
    @Schema(description = "ID del tutor", example = "5")
    private Integer idTutor;
    
    @Schema(description = "Nombre completo del tutor", example = "Juan Pérez")
    private String nombreTutor;
    
    @Schema(description = "ID de la asignatura/carrera", example = "1")
    private Integer idCarrera;
    
    @Schema(description = "Nombre de la carrera del tutor", example = "Ingeniería de Sistemas")
    private String nombreCarrera;
    
    @Schema(description = "Nombre de la asignatura", example = "Cálculo Diferencial")
    private String nombreAsignatura;
    
    @Schema(description = "Nombre de la tutoría", example = "Tutoría de Cálculo")
    private String nombre;
    
    @Schema(description = "Descripción de la tutoría", example = "Tutoría sobre integrales")
    private String descripcion;
    
    @Schema(description = "Capacidad máxima", example = "30")
    private Integer capacidadMaxima;
    
    @Schema(description = "Ubicación", example = "Aula 101")
    private String ubicacion;
    
    @Schema(description = "Modalidad", example = "Presencial")
    private String modalidad;
    
    @Schema(description = "Lugar", example = "Edificio C")
    private String lugar;
    
    @Schema(description = "Estado (1=Activa, 0=Inactiva)", example = "1")
    private Integer estado;
    
    @Schema(description = "Fecha de creación")
    private Timestamp fechaCreacion;
    
    @Schema(description = "Fecha de última modificación")
    private Timestamp fechaUltimaModificacion;
    
    // Constructor vacío
    public TutoriaResponseDto() {
    }
    
    // Constructor completo (original - mantenido por compatibilidad)
    public TutoriaResponseDto(Integer idTutoria, Integer idTutor, String nombreTutor, 
                             Integer idCarrera, String nombreCarrera, String nombre,
                             String descripcion, Integer capacidadMaxima, String ubicacion,
                             String modalidad, String lugar, Integer estado,
                             Timestamp fechaCreacion, Timestamp fechaUltimaModificacion) {
        this.idTutoria = idTutoria;
        this.idTutor = idTutor;
        this.nombreTutor = nombreTutor;
        this.idCarrera = idCarrera;
        this.nombreCarrera = nombreCarrera;
        this.nombre = nombre;
        this.nombreAsignatura = nombre; // Asignar también a nombreAsignatura
        this.descripcion = descripcion;
        this.capacidadMaxima = capacidadMaxima;
        this.ubicacion = ubicacion;
        this.modalidad = modalidad;
        this.lugar = lugar;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.fechaUltimaModificacion = fechaUltimaModificacion;
    }
    
    // Getters y Setters
    public Integer getIdTutoria() {
        return idTutoria;
    }
    
    public void setIdTutoria(Integer idTutoria) {
        this.idTutoria = idTutoria;
    }
    
    public Integer getIdTutor() {
        return idTutor;
    }
    
    public void setIdTutor(Integer idTutor) {
        this.idTutor = idTutor;
    }
    
    public String getNombreTutor() {
        return nombreTutor;
    }
    
    public void setNombreTutor(String nombreTutor) {
        this.nombreTutor = nombreTutor;
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
    
    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }
    
    public void setCapacidadMaxima(Integer capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }
    
    public String getUbicacion() {
        return ubicacion;
    }
    
    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
    
    public String getModalidad() {
        return modalidad;
    }
    
    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }
    
    public String getLugar() {
        return lugar;
    }
    
    public void setLugar(String lugar) {
        this.lugar = lugar;
    }
    
    public Integer getEstado() {
        return estado;
    }
    
    public void setEstado(Integer estado) {
        this.estado = estado;
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
    
    public String getNombreAsignatura() {
        return nombreAsignatura;
    }
    
    public void setNombreAsignatura(String nombreAsignatura) {
        this.nombreAsignatura = nombreAsignatura;
    }
}
