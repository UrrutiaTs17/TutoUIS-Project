package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.modelo.Tutoria;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Servicio para gestionar la actualización automática de estados de tutorías
 * según las fechas y horas de sus disponibilidades.
 * 
 * Estados de Tutoría:
 * 1 = Pendiente - Tutoría creada sin disponibilidades asignadas
 * 2 = Programada - Tiene disponibilidades programadas para el futuro
 * 3 = En Curso - Al menos una disponibilidad se está realizando ahora
 * 4 = Finalizada - Todas las disponibilidades ya finalizaron
 * 5 = Cancelada - La tutoría fue cancelada manualmente
 */
@Service
public class TutoriaEstadoService {

    @Autowired
    private TutoriaRepository tutoriaRepository;

    /**
     * Actualiza los estados de las tutorías cada 5 minutos según sus disponibilidades
     * Cron: Ejecutar cada 5 minutos (segundo, minuto, hora, día, mes, día_semana)
     * 
     * ✅ OPTIMIZADO: Usa una sola query con JOIN FETCH para cargar tutorías + disponibilidades
     */
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void actualizarEstadosDisponibilidades() {
        System.out.println("═══════════════════════════════════════════════════════════════");
        System.out.println("🔄 INICIANDO ACTUALIZACIÓN DE ESTADOS DE TUTORÍAS");
        System.out.println("═══════════════════════════════════════════════════════════════");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        System.out.println("📅 Fecha/Hora actual: " + ahora);
        
        // ✅ OPTIMIZACIÓN: Una sola query con JOIN FETCH para cargar tutorías + disponibilidades
        List<Tutoria> tutorias = tutoriaRepository.findAllTutoriasWithDisponibilidadesForEstadoUpdate()
                .stream()
                .filter(t -> t.getIdEstadoTutoria() != 5) // Excluir canceladas
                .toList();
        
        System.out.println("📊 Total de tutorías a revisar: " + tutorias.size());
        System.out.println("✅ Tutorías + disponibilidades cargadas en 1 sola query (JOIN FETCH)");
        
        int actualizadas = 0;
        int pendientes = 0;
        int programadas = 0;
        int enCurso = 0;
        int finalizadas = 0;
        
        for (Tutoria tutoria : tutorias) {
            // ✅ Las disponibilidades ya están cargadas gracias al JOIN FETCH
            // No se ejecutan queries adicionales aquí
            List<Disponibilidad> disponibilidades = tutoria.getDisponibilidades()
                    .stream()
                    .filter(d -> d.getIdEstado() != 4) // Excluir disponibilidades canceladas
                    .toList();
            
            int estadoAnterior = tutoria.getIdEstadoTutoria() != null ? tutoria.getIdEstadoTutoria() : 1;
            int nuevoEstado = calcularEstadoTutoria(disponibilidades, ahora);
            
            // Solo actualizar si cambió el estado
            if (estadoAnterior != nuevoEstado) {
                tutoria.setIdEstadoTutoria(nuevoEstado);
                tutoriaRepository.save(tutoria);
                actualizadas++;
                
                System.out.println("  ✅ Tutoría ID=" + tutoria.getIdTutoria() + 
                                 " | Descripción=" + (tutoria.getDescripcion() != null && tutoria.getDescripcion().length() > 40 
                                     ? tutoria.getDescripcion().substring(0, 40) + "..." 
                                     : tutoria.getDescripcion()) +
                                 " | Estado: " + obtenerNombreEstadoTutoria(estadoAnterior) + " → " + obtenerNombreEstadoTutoria(nuevoEstado));
                
                switch (nuevoEstado) {
                    case 1 -> pendientes++;
                    case 2 -> programadas++;
                    case 3 -> enCurso++;
                    case 4 -> finalizadas++;
                }
            }
        }
        
        System.out.println("───────────────────────────────────────────────────────────────");
        System.out.println("📊 RESUMEN DE ACTUALIZACIÓN:");
        System.out.println("  • Total revisadas: " + tutorias.size());
        System.out.println("  • Total actualizadas: " + actualizadas);
        System.out.println("  • Cambiadas a PENDIENTE: " + pendientes);
        System.out.println("  • Cambiadas a PROGRAMADA: " + programadas);
        System.out.println("  • Cambiadas a EN CURSO: " + enCurso);
        System.out.println("  • Cambiadas a FINALIZADA: " + finalizadas);
        System.out.println("═══════════════════════════════════════════════════════════════");
    }
    
    /**
     * Calcula el estado de una tutoría según sus disponibilidades
     * 
     * Lógica:
     * 1. Si no tiene disponibilidades → PENDIENTE (1)
     * 2. Si alguna está EN CURSO ahora → EN CURSO (3)
     * 3. Si todas ya finalizaron → FINALIZADA (4)
     * 4. Si tiene alguna futura → PROGRAMADA (2)
     * 5. Por defecto → PENDIENTE (1)
     */
    private int calcularEstadoTutoria(List<Disponibilidad> disponibilidades, LocalDateTime ahora) {
        // Caso 1: Sin disponibilidades
        if (disponibilidades == null || disponibilidades.isEmpty()) {
            System.out.println("    ℹ️ Sin disponibilidades → PENDIENTE");
            return 1; // PENDIENTE
        }
        
        boolean hayEnCurso = false;
        boolean hayFuturas = false;
        int totalDisponibilidades = disponibilidades.size();
        int finalizadas = 0;
        
        for (Disponibilidad disp : disponibilidades) {
            try {
                LocalDate fechaDisp = disp.getFecha().toLocalDate();
                LocalTime horaInicio = disp.getHoraInicio().toLocalTime();
                LocalTime horaFin = disp.getHoraFin().toLocalTime();
                
                LocalDateTime inicioDisponibilidad = LocalDateTime.of(fechaDisp, horaInicio);
                LocalDateTime finDisponibilidad = LocalDateTime.of(fechaDisp, horaFin);
                
                // Clasificar la disponibilidad
                if (ahora.isAfter(inicioDisponibilidad) && ahora.isBefore(finDisponibilidad)) {
                    hayEnCurso = true; // Está ocurriendo AHORA
                    System.out.println("    ⏱️ Disponibilidad EN CURSO: " + fechaDisp + " " + horaInicio + "-" + horaFin);
                } else if (ahora.isBefore(inicioDisponibilidad)) {
                    hayFuturas = true; // Está en el FUTURO
                } else if (ahora.isAfter(finDisponibilidad)) {
                    finalizadas++; // Ya FINALIZÓ
                }
                
            } catch (Exception e) {
                System.err.println("    ⚠️ Error procesando disponibilidad ID=" + disp.getIdDisponibilidad() + ": " + e.getMessage());
                // Si hay error, asumir que no afecta el estado
            }
        }
        
        // Caso 2: Al menos una EN CURSO (prioridad máxima)
        if (hayEnCurso) {
            System.out.println("    ✅ Resultado: EN CURSO (hay " + totalDisponibilidades + " disponibilidad(es), al menos 1 activa ahora)");
            return 3; // EN CURSO
        }
        
        // Caso 3: TODAS finalizadas
        if (finalizadas == totalDisponibilidades) {
            System.out.println("    ✅ Resultado: FINALIZADA (todas las " + finalizadas + " disponibilidades ya terminaron)");
            return 4; // FINALIZADA
        }
        
        // Caso 4: Tiene disponibilidades FUTURAS
        if (hayFuturas) {
            System.out.println("    ✅ Resultado: PROGRAMADA (hay disponibilidades futuras)");
            return 2; // PROGRAMADA
        }
        
        // Caso 5: Por defecto (no debería llegar aquí normalmente)
        System.out.println("    ⚠️ Resultado: PENDIENTE (caso por defecto - revisar lógica)");
        return 1; // PENDIENTE
    }
    
    /**
     * Obtiene el nombre descriptivo de un estado de tutoría
     */
    private String obtenerNombreEstadoTutoria(int idEstado) {
        return switch (idEstado) {
            case 1 -> "PENDIENTE";
            case 2 -> "PROGRAMADA";
            case 3 -> "EN CURSO";
            case 4 -> "FINALIZADA";
            case 5 -> "CANCELADA";
            default -> "DESCONOCIDO";
        };
    }
    
    /**
     * Método para ejecutar la actualización manualmente (útil para pruebas)
     */
    public void actualizarEstadosManualmente() {
        System.out.println("🔧 Actualización manual solicitada");
        actualizarEstadosDisponibilidades();
    }
}
