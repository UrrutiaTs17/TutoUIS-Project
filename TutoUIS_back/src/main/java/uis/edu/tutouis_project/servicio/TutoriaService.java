package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.dto.CrearTutoriaConDisponibilidadDto;
import uis.edu.tutouis_project.dto.TutoriaResponseDto;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.modelo.Tutoria;
import uis.edu.tutouis_project.repositorio.AsignaturaRepository;
import uis.edu.tutouis_project.repositorio.CarreraRepository;
import uis.edu.tutouis_project.repositorio.DisponibilidadRepository;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;
import uis.edu.tutouis_project.repositorio.UsuarioRepository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TutoriaService {

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;
    
    @Autowired
    private CarreraRepository carreraRepository;
    
    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    /**
     * Obtiene todas las tutorías con información completa (nombre tutor, nombre asignatura)
     * OPTIMIZADO: Usa una sola query con JOINs para evitar el problema N+1
     */
    public List<TutoriaResponseDto> obtenerTodasLasTutorias() {
        System.out.println("🔵 TutoriaService: Iniciando obtenerTodasLasTutorias() [VERSIÓN OPTIMIZADA]");
        long inicio = System.currentTimeMillis();
        
        // Una sola consulta con JOINs - evita el problema N+1
        List<TutoriaResponseDto> resultado = tutoriaRepository.findAllTutoriasWithDetails();
        
        long fin = System.currentTimeMillis();
        System.out.println("✅ TutoriaService: Se obtuvieron " + resultado.size() + " tutorías en " + (fin - inicio) + "ms con UNA sola query SQL");
        
        return resultado;
    }
    
    /**
     * MÉTODO DEPRECADO - Mantenido solo por compatibilidad
     * Convertía entidades a DTO con múltiples queries (problema N+1)
     */
    @Deprecated
    private TutoriaResponseDto convertirATutoriaResponseDto(Tutoria tutoria) {
        System.out.println("⚠️ ADVERTENCIA: Usando método DEPRECADO con problema N+1");
        System.out.println("🔄 TutoriaService: Convirtiendo tutoría ID=" + tutoria.getIdTutoria());
        
        TutoriaResponseDto dto = new TutoriaResponseDto();
        
        dto.setIdTutoria(tutoria.getIdTutoria());
        dto.setIdTutor(tutoria.getIdTutor());
        dto.setIdCarrera(tutoria.getIdAsignatura());
        dto.setDescripcion(tutoria.getDescripcion());
        dto.setCapacidadMaxima(tutoria.getCapacidadMaxima());
        dto.setUbicacion(tutoria.getLugar());
        dto.setModalidad(tutoria.getModalidad());
        dto.setLugar(tutoria.getLugar());
        dto.setEstado(tutoria.getEstado());
        dto.setFechaCreacion(tutoria.getFechaCreacion());
        dto.setFechaUltimaModificacion(tutoria.getFechaUltimaModificacion());
        
        System.out.println("  📝 Datos básicos: capacidad=" + dto.getCapacidadMaxima());
        
        // Obtener nombre del tutor y su carrera
        if (tutoria.getIdTutor() != null) {
            System.out.println("  🔍 Buscando tutor con ID=" + tutoria.getIdTutor());
            usuarioRepository.findById(tutoria.getIdTutor()).ifPresent(tutor -> {
                String nombreCompleto = (tutor.getNombre() != null ? tutor.getNombre() : "") + 
                                       " " + 
                                       (tutor.getApellido() != null ? tutor.getApellido() : "");
                dto.setNombreTutor(nombreCompleto.trim());
                System.out.println("  ✅ Tutor encontrado: " + nombreCompleto.trim());
                
                // Obtener la carrera del tutor usando id_carrera
                if (tutor.getId_carrera() != null) {
                    System.out.println("  🔍 Buscando carrera con ID=" + tutor.getId_carrera());
                    carreraRepository.findById(tutor.getId_carrera()).ifPresent(carrera -> {
                        dto.setNombreCarrera(carrera.getNombre());
                        System.out.println("  ✅ Carrera del tutor: " + carrera.getNombre());
                    });
                } else {
                    System.out.println("  ⚠️ El tutor no tiene carrera asignada");
                }
            });
            if (dto.getNombreTutor() == null) {
                System.out.println("  ⚠️ No se encontró tutor con ID=" + tutoria.getIdTutor());
            }
        } else {
            System.out.println("  ⚠️ La tutoría no tiene idTutor asignado");
        }
        
        // Obtener nombre de la asignatura
        if (tutoria.getIdAsignatura() != null) {
            System.out.println("  🔍 Buscando asignatura con ID=" + tutoria.getIdAsignatura());
            asignaturaRepository.findById(tutoria.getIdAsignatura()).ifPresent(asignatura -> {
                dto.setNombre(asignatura.getNombre()); // Para compatibilidad
                dto.setNombreAsignatura(asignatura.getNombre()); // Nombre de asignatura
                System.out.println("  ✅ Asignatura encontrada: " + asignatura.getNombre());
            });
            if (dto.getNombre() == null) {
                System.out.println("  ⚠️ No se encontró asignatura con ID=" + tutoria.getIdAsignatura());
            }
        } else {
            System.out.println("  ⚠️ La tutoría no tiene idAsignatura asignado");
        }
        
        System.out.println("  ✅ DTO completado: nombreAsignatura=" + dto.getNombreAsignatura() + ", nombreTutor=" + dto.getNombreTutor() + ", nombreCarrera=" + dto.getNombreCarrera());
        return dto;
    }
    
    /**
     * Crea una tutoría junto con sus disponibilidades en una transacción
     */
    @Transactional
    public Tutoria crearTutoriaConDisponibilidades(CrearTutoriaConDisponibilidadDto dto) {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("🔵 TutoriaService: CREANDO TUTORÍA CON DISPONIBILIDADES");
        System.out.println("═══════════════════════════════════════════════════════");
        
        // Validar que el tutor existe
        if (!usuarioRepository.existsById(dto.getIdTutor())) {
            throw new RuntimeException("El tutor con ID " + dto.getIdTutor() + " no existe");
        }
        
        // 1. VALIDAR CONFLICTOS DE HORARIO antes de crear nada
        System.out.println("🔍 VALIDANDO CONFLICTOS DE HORARIO...");
        if (dto.getDisponibilidades() != null && !dto.getDisponibilidades().isEmpty()) {
            for (int i = 0; i < dto.getDisponibilidades().size(); i++) {
                CrearTutoriaConDisponibilidadDto.DisponibilidadDto dispDto = dto.getDisponibilidades().get(i);
                
                try {
                    Date fecha = Date.valueOf(dispDto.getFecha());
                    Time horaInicio = Time.valueOf(dispDto.getHoraInicio());
                    Time horaFin = Time.valueOf(dispDto.getHoraFin());
                    
                    // Buscar conflictos con otras disponibilidades del mismo tutor
                    List<Disponibilidad> conflictos = disponibilidadRepository.findConflictosHorario(
                        dto.getIdTutor(),
                        fecha,
                        horaInicio,
                        horaFin
                    );
                    
                    if (!conflictos.isEmpty()) {
                        Disponibilidad conflicto = conflictos.get(0);
                        String mensaje = String.format(
                            "❌ CONFLICTO DE HORARIO: La disponibilidad %d (%s %s %s-%s) se solapa con una tutoría existente " +
                            "(Tutoría ID: %d, %s %s-%s). El tutor ya tiene una tutoría programada en ese horario.",
                            (i + 1),
                            dispDto.getDiaSemana(),
                            dispDto.getFecha(),
                            dispDto.getHoraInicio(),
                            dispDto.getHoraFin(),
                            conflicto.getIdTutoria(),
                            conflicto.getFecha(),
                            conflicto.getHoraInicio(),
                            conflicto.getHoraFin()
                        );
                        System.err.println(mensaje);
                        throw new RuntimeException(mensaje);
                    }
                    
                    System.out.println("  ✅ Disponibilidad " + (i + 1) + ": Sin conflictos (" + 
                                     dispDto.getDiaSemana() + " " + dispDto.getFecha() + " " + 
                                     dispDto.getHoraInicio() + "-" + dispDto.getHoraFin() + ")");
                    
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Error en el formato de fecha/hora de la disponibilidad " + (i + 1) + ": " + e.getMessage());
                }
            }
        }
        
        System.out.println("✅ No hay conflictos de horario. Procediendo a crear tutoría...");
        
        // 2. Crear la tutoría
        Tutoria tutoria = new Tutoria();
        tutoria.setIdTutor(dto.getIdTutor());
        tutoria.setIdAsignatura(dto.getIdAsignatura());
        tutoria.setModalidad(dto.getModalidad());
        tutoria.setLugar(dto.getLugar());
        tutoria.setDescripcion(dto.getDescripcion());
        tutoria.setCapacidadMaxima(dto.getCapacidadMaxima());
        tutoria.setEstado(dto.getEstado() != null ? dto.getEstado() : 1); // Por defecto activa
        
        Tutoria tutoriaGuardada = tutoriaRepository.save(tutoria);
        System.out.println("✅ Tutoría guardada con ID: " + tutoriaGuardada.getIdTutoria());
        
        // 3. Crear las disponibilidades
        if (dto.getDisponibilidades() != null && !dto.getDisponibilidades().isEmpty()) {
            List<Disponibilidad> disponibilidades = new ArrayList<>();
            
            for (CrearTutoriaConDisponibilidadDto.DisponibilidadDto dispDto : dto.getDisponibilidades()) {
                // Ya validamos el formato antes, aquí solo creamos
                Date fecha = Date.valueOf(dispDto.getFecha());
                Time horaInicio = Time.valueOf(dispDto.getHoraInicio());
                Time horaFin = Time.valueOf(dispDto.getHoraFin());
                
                // Crear la disponibilidad usando el constructor que inicializa los campos correctamente
                Disponibilidad disponibilidad = new Disponibilidad(
                    tutoriaGuardada.getIdTutoria(),
                    fecha,
                    dispDto.getDiaSemana(),
                    horaInicio,
                    horaFin,
                    dispDto.getAforoMaximo()
                );
                
                Disponibilidad dispGuardada = disponibilidadRepository.save(disponibilidad);
                disponibilidades.add(dispGuardada);
                
                System.out.println("  ✅ Disponibilidad guardada: " + dispDto.getDiaSemana() + 
                                 " " + dispDto.getFecha() + " " + dispDto.getHoraInicio() + 
                                 "-" + dispDto.getHoraFin());
            }
            
            System.out.println("✅ Se crearon " + disponibilidades.size() + " disponibilidades");
        }
        
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("✅ TUTORÍA CREADA EXITOSAMENTE CON TODAS SUS DISPONIBILIDADES");
        System.out.println("═══════════════════════════════════════════════════════");
        
        return tutoriaGuardada;
    }
    
    /**
     * Actualiza una tutoría permitiendo editar solo ciertos campos:
     * - descripcion
     * - ubicacion
     * - disponibilidades (reemplaza todas las existentes)
     */
    @Transactional
    public Tutoria actualizarTutoriaEditable(Integer idTutoria, Map<String, Object> datos) {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("📝 ACTUALIZANDO TUTORÍA (CAMPOS EDITABLES)");
        System.out.println("   ID Tutoría: " + idTutoria);
        System.out.println("═══════════════════════════════════════════════════════");
        
        // 1. Buscar la tutoría
        Tutoria tutoria = tutoriaRepository.findById(idTutoria)
                .orElseThrow(() -> new RuntimeException("Tutoría no encontrada con ID: " + idTutoria));
        
        System.out.println("📋 Tutoría encontrada: " + tutoria.getIdTutoria());
        
        // 2. Actualizar solo los campos editables
        if (datos.containsKey("descripcion")) {
            String descripcion = (String) datos.get("descripcion");
            tutoria.setDescripcion(descripcion);
            System.out.println("   ✏️ Descripción actualizada");
        }
        
        if (datos.containsKey("ubicacion")) {
            String ubicacion = (String) datos.get("ubicacion");
            tutoria.setLugar(ubicacion);
            System.out.println("   ✏️ Ubicación actualizada: " + ubicacion);
        }
        
        // 3. Manejar disponibilidades: eliminar las antiguas y crear las nuevas
        if (datos.containsKey("disponibilidades")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> disponibilidadesData = (List<Map<String, Object>>) datos.get("disponibilidades");
            
            // 3.1. Eliminar todas las disponibilidades existentes (y sus reservas en cascada)
            List<Disponibilidad> disponibilidadesAnteriores = disponibilidadRepository.findByIdTutoria(idTutoria);
            System.out.println("   🗑️ Eliminando " + disponibilidadesAnteriores.size() + " disponibilidad(es) anterior(es)");
            
            for (Disponibilidad disp : disponibilidadesAnteriores) {
                // Primero eliminar las reservas de esta disponibilidad
                long cantidadReservas = tutoriaRepository.countReservasByDisponibilidad(disp.getIdDisponibilidad());
                if (cantidadReservas > 0) {
                    tutoriaRepository.deleteReservasByDisponibilidad(disp.getIdDisponibilidad());
                    System.out.println("      🗑️ Eliminadas " + cantidadReservas + " reserva(s) de disponibilidad ID=" + disp.getIdDisponibilidad());
                }
                // Luego eliminar la disponibilidad
                disponibilidadRepository.deleteById(disp.getIdDisponibilidad());
            }
            
            // 3.2. Crear las nuevas disponibilidades
            System.out.println("   ➕ Creando " + disponibilidadesData.size() + " nueva(s) disponibilidad(es)");
            
            // Obtener capacidad máxima de la tutoría para inicializar aforos
            Integer capacidadMaxima = tutoria.getCapacidadMaxima();
            
            for (Map<String, Object> dispData : disponibilidadesData) {
                String diaSemana = (String) dispData.get("diaSemana");
                
                // Convertir fecha de String a java.sql.Date
                String fechaStr = (String) dispData.get("fecha");
                Date fecha = Date.valueOf(fechaStr);
                
                // Convertir horas de String a java.sql.Time
                String horaInicioStr = (String) dispData.get("horaInicio");
                String horaFinStr = (String) dispData.get("horaFin");
                Time horaInicio = Time.valueOf(horaInicioStr + ":00");
                Time horaFin = Time.valueOf(horaFinStr + ":00");
                
                // Crear nueva disponibilidad usando el constructor
                Disponibilidad nuevaDisp = new Disponibilidad(idTutoria, fecha, diaSemana, horaInicio, horaFin, capacidadMaxima);
                
                disponibilidadRepository.save(nuevaDisp);
                System.out.println("      ✅ Disponibilidad creada: " + nuevaDisp.getDiaSemana() + " " + 
                                   nuevaDisp.getFecha() + " " + nuevaDisp.getHoraInicio() + "-" + nuevaDisp.getHoraFin());
            }
        }
        
        // 4. Guardar la tutoría actualizada
        Tutoria tutoriaActualizada = tutoriaRepository.save(tutoria);
        
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("✅ ACTUALIZACIÓN COMPLETADA EXITOSAMENTE");
        System.out.println("═══════════════════════════════════════════════════════");
        
        return tutoriaActualizada;
    }
    
    /**
     * Elimina una tutoría junto con todas sus disponibilidades y reservas en cascada
     * Orden: Reservas -> Disponibilidades -> Tutoría
     */
    @Transactional
    public void eliminarTutoriaConDependencias(Integer idTutoria) {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("🗑️ ELIMINANDO TUTORÍA CON TODAS SUS DEPENDENCIAS");
        System.out.println("   ID Tutoría: " + idTutoria);
        System.out.println("═══════════════════════════════════════════════════════");
        
        // Verificar que la tutoría existe
        if (!tutoriaRepository.existsById(idTutoria)) {
            throw new RuntimeException("Tutoría no encontrada con ID: " + idTutoria);
        }
        
        // 1. Obtener todas las disponibilidades de esta tutoría
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByIdTutoria(idTutoria);
        System.out.println("📋 Disponibilidades encontradas: " + disponibilidades.size());
        
        int totalReservasEliminadas = 0;
        
        // 2. Para cada disponibilidad, eliminar primero sus reservas
        for (Disponibilidad disp : disponibilidades) {
            // Obtener cantidad de reservas antes de eliminar
            long cantidadReservas = tutoriaRepository.countReservasByDisponibilidad(disp.getIdDisponibilidad());
            
            if (cantidadReservas > 0) {
                // Eliminar todas las reservas de esta disponibilidad
                tutoriaRepository.deleteReservasByDisponibilidad(disp.getIdDisponibilidad());
                totalReservasEliminadas += cantidadReservas;
                System.out.println("  🗑️ Eliminadas " + cantidadReservas + " reserva(s) de disponibilidad ID=" + disp.getIdDisponibilidad());
            }
        }
        
        // 3. Ahora eliminar todas las disponibilidades
        for (Disponibilidad disp : disponibilidades) {
            disponibilidadRepository.deleteById(disp.getIdDisponibilidad());
        }
        System.out.println("✅ Eliminadas " + disponibilidades.size() + " disponibilidad(es)");
        
        // 4. Finalmente eliminar la tutoría
        tutoriaRepository.deleteById(idTutoria);
        System.out.println("✅ Tutoría eliminada");
        
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("✅ ELIMINACIÓN COMPLETADA EXITOSAMENTE");
        System.out.println("   📊 Resumen:");
        System.out.println("      - Tutorías eliminadas: 1");
        System.out.println("      - Disponibilidades eliminadas: " + disponibilidades.size());
        System.out.println("      - Reservas eliminadas: " + totalReservasEliminadas);
        System.out.println("═══════════════════════════════════════════════════════");
    }
}
