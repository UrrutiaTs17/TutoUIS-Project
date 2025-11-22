package uis.edu.tutouis_project.dto;

import java.util.List;

public class CrearTutoriaConDisponibilidadDto {
    
    // Datos de la tutoría
    private Integer idTutor;
    private Integer idAsignatura;
    private String modalidad;
    private String lugar;
    private String descripcion;
    private Integer capacidadMaxima;
    private Integer estado;
    
    // Datos de las disponibilidades
    private List<DisponibilidadDto> disponibilidades;
    
    // Clase interna para las disponibilidades
    public static class DisponibilidadDto {
        private String diaSemana;
        private String fecha;
        private String horaInicio;
        private String horaFin;
        private Integer aforoMaximo;
        
        // Getters y Setters
        public String getDiaSemana() {
            return diaSemana;
        }
        
        public void setDiaSemana(String diaSemana) {
            this.diaSemana = diaSemana;
        }
        
        public String getFecha() {
            return fecha;
        }
        
        public void setFecha(String fecha) {
            this.fecha = fecha;
        }
        
        public String getHoraInicio() {
            return horaInicio;
        }
        
        public void setHoraInicio(String horaInicio) {
            this.horaInicio = horaInicio;
        }
        
        public String getHoraFin() {
            return horaFin;
        }
        
        public void setHoraFin(String horaFin) {
            this.horaFin = horaFin;
        }
        
        public Integer getAforoMaximo() {
            return aforoMaximo;
        }
        
        public void setAforoMaximo(Integer aforoMaximo) {
            this.aforoMaximo = aforoMaximo;
        }
    }
    
    // Getters y Setters de la tutoría
    public Integer getIdTutor() {
        return idTutor;
    }
    
    public void setIdTutor(Integer idTutor) {
        this.idTutor = idTutor;
    }
    
    public Integer getIdAsignatura() {
        return idAsignatura;
    }
    
    public void setIdAsignatura(Integer idAsignatura) {
        this.idAsignatura = idAsignatura;
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
    
    public Integer getEstado() {
        return estado;
    }
    
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    
    public List<DisponibilidadDto> getDisponibilidades() {
        return disponibilidades;
    }
    
    public void setDisponibilidades(List<DisponibilidadDto> disponibilidades) {
        this.disponibilidades = disponibilidades;
    }
}
