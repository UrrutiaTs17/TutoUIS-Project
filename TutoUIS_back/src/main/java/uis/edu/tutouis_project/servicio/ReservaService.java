package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.modelo.EstadoReserva;
import uis.edu.tutouis_project.modelo.dto.CreateReservaDto;
import uis.edu.tutouis_project.modelo.dto.UpdateReservaDto;
import uis.edu.tutouis_project.modelo.dto.ReservaResponseDto;
import uis.edu.tutouis_project.repositorio.ReservaRepository;
import uis.edu.tutouis_project.repositorio.DisponibilidadRepository;
import uis.edu.tutouis_project.repositorio.UsuarioRepository;
import uis.edu.tutouis_project.repositorio.EstadoReservaRepository;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;
import uis.edu.tutouis_project.modelo.Tutoria;

import java.util.List;

@Service
public class ReservaService implements IReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Override
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    @Override
    public List<ReservaResponseDto> listarTodasLasReservas() {
        List<Reserva> reservas = reservaRepository.findAll();
        return reservas.stream()
                .map(this::convertirAResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Reserva obtenerReservaPorId(Integer idReserva) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }
        return reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));
    }

    @Override
    public List<Reserva> obtenerReservasPorUsuario(Integer idEstudiante) {
        if (idEstudiante == null || idEstudiante <= 0) {
            throw new IllegalArgumentException("El ID del estudiante debe ser un número positivo");
        }
        return reservaRepository.findByIdEstudiante(idEstudiante);
    }

    @Override
    public List<ReservaResponseDto> obtenerReservasDtosPorUsuario(Integer idEstudiante) {
        if (idEstudiante == null || idEstudiante <= 0) {
            throw new IllegalArgumentException("El ID del estudiante debe ser un número positivo");
        }
        
        System.out.println("📊 Consultando reservas con JOIN FETCH optimizado para estudiante: " + idEstudiante);
        List<Reserva> reservas = reservaRepository.findByIdEstudianteWithDetails(idEstudiante);
        System.out.println("✅ Reservas obtenidas: " + reservas.size());
        
        return reservas.stream()
                .map(this::convertirAResponseDtoOptimizado)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<Reserva> obtenerReservasPorDisponibilidad(Integer idDisponibilidad) {
        if (idDisponibilidad == null || idDisponibilidad <= 0) {
            throw new IllegalArgumentException("El ID de disponibilidad debe ser un número positivo");
        }
        return reservaRepository.findByIdDisponibilidad(idDisponibilidad);
    }

    @Override
    public List<Reserva> obtenerReservasPorUsuarioYEstado(Integer idEstudiante, Integer idEstado) {
        if (idEstudiante == null || idEstudiante <= 0) {
            throw new IllegalArgumentException("El ID del estudiante debe ser un número positivo");
        }
        if (idEstado == null || idEstado <= 0) {
            throw new IllegalArgumentException("El ID del estado debe ser un número positivo");
        }
        return reservaRepository.findByIdEstudianteAndIdEstado(idEstudiante, idEstado);
    }

    @Override
    public List<Reserva> obtenerReservasActivasDeUsuario(Integer idEstudiante) {
        if (idEstudiante == null || idEstudiante <= 0) {
            throw new IllegalArgumentException("El ID del estudiante debe ser un número positivo");
        }
        // Estados: 1 = Reservada, 3 = Realizada
        List<Reserva> activas = reservaRepository.findByIdEstudianteAndIdEstado(idEstudiante, 1);
        return activas;
    }

    @Override
    public ReservaResponseDto crearReserva(CreateReservaDto createDto) {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("🆕 INICIANDO CREACIÓN DE NUEVA RESERVA");
        System.out.println("═══════════════════════════════════════════════════════");
        
        // Validar entrada
        if (createDto == null) {
            throw new IllegalArgumentException("El DTO de creación no puede ser nulo");
        }
        
        System.out.println("📥 DATOS RECIBIDOS:");
        System.out.println("  - ID Disponibilidad: " + createDto.getIdDisponibilidad());
        System.out.println("  - ID Estudiante: " + createDto.getIdEstudiante());
        System.out.println("  - Hora Inicio: " + createDto.getHoraInicio());
        System.out.println("  - Hora Fin: " + createDto.getHoraFin());
        System.out.println("  - Observaciones: " + (createDto.getObservaciones() != null ? createDto.getObservaciones() : "(ninguna)"));
        
        if (createDto.getIdDisponibilidad() == null || createDto.getIdDisponibilidad() <= 0) {
            throw new IllegalArgumentException("El ID de disponibilidad es requerido y debe ser positivo");
        }
        if (createDto.getIdEstudiante() == null || createDto.getIdEstudiante() <= 0) {
            throw new IllegalArgumentException("El ID del estudiante es requerido y debe ser positivo");
        }
        if (createDto.getHoraInicio() == null) {
            throw new IllegalArgumentException("La hora de inicio es requerida");
        }
        if (createDto.getHoraFin() == null) {
            throw new IllegalArgumentException("La hora de fin es requerida");
        }

        // Validar que la sesión sea de exactamente 15 minutos
        long minutos = java.time.Duration.between(createDto.getHoraInicio(), createDto.getHoraFin()).toMinutes();
        System.out.println("⏱️  Duración de la sesión: " + minutos + " minutos");
        if (minutos != 15) {
            throw new IllegalArgumentException("La reserva debe ser de exactamente 15 minutos. Duración actual: " + minutos + " minutos");
        }

        // Verificar que la disponibilidad existe
        System.out.println("🔍 Buscando disponibilidad...");
        Disponibilidad disponibilidad = disponibilidadRepository.findById(createDto.getIdDisponibilidad())
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada con ID: " + createDto.getIdDisponibilidad()));
        System.out.println("✅ Disponibilidad encontrada: ID=" + disponibilidad.getIdDisponibilidad() + 
                         ", Rango=" + disponibilidad.getHoraInicio() + " - " + disponibilidad.getHoraFin() +
                         ", Aforo disponible=" + disponibilidad.getAforoDisponible());

        // Validar que la hora de inicio esté dentro del rango de la disponibilidad
        java.time.LocalTime dispHoraInicio = disponibilidad.getHoraInicio().toLocalTime();
        java.time.LocalTime dispHoraFin = disponibilidad.getHoraFin().toLocalTime();
        
        if (createDto.getHoraInicio().isBefore(dispHoraInicio) || 
            createDto.getHoraFin().isAfter(dispHoraFin)) {
            throw new RuntimeException("El horario de la reserva (" + createDto.getHoraInicio() + " - " + createDto.getHoraFin() + 
                                     ") debe estar dentro del rango de la disponibilidad (" + 
                                     dispHoraInicio + " - " + dispHoraFin + ")");
        }

        // Verificar que hay cupos disponibles
        if (disponibilidad.getAforoDisponible() <= 0) {
            throw new RuntimeException("No hay cupos disponibles en esta tutoría");
        }

        // Verificar que el usuario (estudiante) existe
        usuarioRepository.findById(createDto.getIdEstudiante())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + createDto.getIdEstudiante()));

        // Verificar que no exista otra reserva en el mismo horario
        System.out.println("🔍 VERIFICANDO RESERVAS EXISTENTES:");
        System.out.println("  📋 Estudiante ID: " + createDto.getIdEstudiante());
        System.out.println("  📋 Disponibilidad ID: " + createDto.getIdDisponibilidad());
        System.out.println("  ⏰ Horario solicitado: " + createDto.getHoraInicio() + " - " + createDto.getHoraFin());
        
        List<Reserva> reservasExistentes = reservaRepository.findByIdEstudianteAndIdEstado(createDto.getIdEstudiante(), 1);
        System.out.println("  📊 Total de reservas activas del estudiante: " + reservasExistentes.size());
        
        if (!reservasExistentes.isEmpty()) {
            System.out.println("  📝 Detalle de reservas existentes:");
            for (Reserva r : reservasExistentes) {
                System.out.println("    - Reserva ID=" + r.getIdReserva() + 
                                 ", Disponibilidad=" + r.getIdDisponibilidad() + 
                                 ", Horario=" + r.getHoraInicio() + " - " + r.getHoraFin());
            }
        }
        
        boolean yaReservado = reservasExistentes.stream()
                .anyMatch(r -> {
                    boolean mismaDisponibilidad = r.getIdDisponibilidad().equals(createDto.getIdDisponibilidad());
                    boolean mismaHora = r.getHoraInicio().equals(createDto.getHoraInicio());
                    if (mismaDisponibilidad && mismaHora) {
                        System.out.println("  ❌ CONFLICTO ENCONTRADO:");
                        System.out.println("    - Reserva existente ID=" + r.getIdReserva());
                        System.out.println("    - Misma disponibilidad: " + mismaDisponibilidad);
                        System.out.println("    - Misma hora de inicio: " + mismaHora);
                    }
                    return mismaDisponibilidad && mismaHora;
                });
        
        if (yaReservado) {
            System.out.println("  🚫 RECHAZANDO: Ya existe una reserva en este horario");
            throw new RuntimeException("Ya existe una reserva en este horario (" + createDto.getHoraInicio() + " - " + createDto.getHoraFin() + ")");
        }
        
        System.out.println("  ✅ No hay conflictos, procediendo a crear la reserva...");

        // Crear la nueva reserva
        Reserva nuevaReserva = new Reserva();
        nuevaReserva.setIdDisponibilidad(createDto.getIdDisponibilidad());
        nuevaReserva.setIdEstudiante(createDto.getIdEstudiante());
        nuevaReserva.setIdEstado(1); // Reservada
        nuevaReserva.setObservaciones(createDto.getObservaciones());
        nuevaReserva.setHoraInicio(createDto.getHoraInicio());
        nuevaReserva.setHoraFin(createDto.getHoraFin());
        nuevaReserva.setFechaCreacion(new java.sql.Timestamp(System.currentTimeMillis()));

        System.out.println("💾 Guardando reserva en la base de datos...");
        Reserva reservaGuardada = reservaRepository.save(nuevaReserva);
        System.out.println("✅ Reserva guardada exitosamente con ID: " + reservaGuardada.getIdReserva());

        // Actualizar aforo disponible
        System.out.println("📊 Actualizando aforo disponible de " + disponibilidad.getAforoDisponible() + " a " + (disponibilidad.getAforoDisponible() - 1));
        disponibilidad.setAforoDisponible(disponibilidad.getAforoDisponible() - 1);
        disponibilidadRepository.save(disponibilidad);

        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("✅ RESERVA CREADA EXITOSAMENTE - ID: " + reservaGuardada.getIdReserva());
        System.out.println("═══════════════════════════════════════════════════════");
        
        return convertirAResponseDto(reservaGuardada);
    }

    @Override
    public ReservaResponseDto actualizarReserva(Integer idReserva, UpdateReservaDto updateDto) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }
        if (updateDto == null) {
            throw new IllegalArgumentException("El DTO de actualización no puede ser nulo");
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));

        if (updateDto.getObservaciones() != null) {
            reserva.setObservaciones(updateDto.getObservaciones());
        }

        Reserva reservaActualizada = reservaRepository.save(reserva);
        return convertirAResponseDto(reservaActualizada);
    }

    @Override
    public ReservaResponseDto cancelarReserva(Integer idReserva, String razonCancelacion) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));

        if (reserva.getIdEstado() == 2) {
            throw new RuntimeException("La reserva ya ha sido cancelada");
        }

        reserva.setIdEstado(2); // Cancelada
        reserva.setRazonCancelacion(razonCancelacion);

        // Incrementar el aforo disponible
        Disponibilidad disponibilidad = disponibilidadRepository.findById(reserva.getIdDisponibilidad())
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));
        disponibilidad.setAforoDisponible(disponibilidad.getAforoDisponible() + 1);
        disponibilidadRepository.save(disponibilidad);

        Reserva reservaCancelada = reservaRepository.save(reserva);
        return convertirAResponseDto(reservaCancelada);
    }

    @Override
    public ReservaResponseDto marcarReservaRealizada(Integer idReserva) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));

        reserva.setIdEstado(3); // Realizada
        Reserva reservaActualizada = reservaRepository.save(reserva);
        return convertirAResponseDto(reservaActualizada);
    }

    @Override
    public ReservaResponseDto marcarReservaNoAsistida(Integer idReserva) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));

        reserva.setIdEstado(4); // No Asistida
        Reserva reservaActualizada = reservaRepository.save(reserva);
        return convertirAResponseDto(reservaActualizada);
    }

    @Override
    public void eliminarReserva(Integer idReserva) {
        if (idReserva == null || idReserva <= 0) {
            throw new IllegalArgumentException("El ID de la reserva debe ser un número positivo");
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + idReserva));

        // Si la reserva es reciente y está en estado "Reservada", liberar el cupo
        if (reserva.getIdEstado() == 1) {
            Disponibilidad disponibilidad = disponibilidadRepository.findById(reserva.getIdDisponibilidad())
                    .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));
            disponibilidad.setAforoDisponible(disponibilidad.getAforoDisponible() + 1);
            disponibilidadRepository.save(disponibilidad);
        }

        reservaRepository.deleteById(idReserva);
    }

    /**
     * Convierte una entidad Reserva a su DTO de respuesta
     */
    private ReservaResponseDto convertirAResponseDto(Reserva reserva) {
        ReservaResponseDto dto = new ReservaResponseDto();
        dto.setIdReserva(reserva.getIdReserva());
        dto.setIdDisponibilidad(reserva.getIdDisponibilidad());
        dto.setIdEstudiante(reserva.getIdEstudiante());
        dto.setIdEstado(reserva.getIdEstado());
        dto.setObservaciones(reserva.getObservaciones());
        dto.setFechaCreacion(reserva.getFechaCreacion());
        dto.setFechaCancelacion(reserva.getFechaCancelacion());
        dto.setRazonCancelacion(reserva.getRazonCancelacion());
        dto.setHoraInicio(reserva.getHoraInicio());
        dto.setHoraFin(reserva.getHoraFin());

        // Obtener información de la disponibilidad, tutoría y asignatura
        disponibilidadRepository.findById(reserva.getIdDisponibilidad()).ifPresent(disponibilidad -> {
            dto.setDisponibilidadHoraInicio(disponibilidad.getHoraInicio().toLocalTime());
            dto.setDisponibilidadHoraFin(disponibilidad.getHoraFin().toLocalTime());
            
            // Obtener información de la tutoría
            if (disponibilidad.getIdTutoria() != null) {
                tutoriaRepository.findById(disponibilidad.getIdTutoria()).ifPresent(tutoria -> {
                    // Obtener nombre de la asignatura
                    if (tutoria.getAsignatura() != null) {
                        dto.setNombreAsignatura(tutoria.getAsignatura().getNombre());
                    }
                    // Obtener nombre del tutor
                    if (tutoria.getTutor() != null) {
                        String nombreTutor = (tutoria.getTutor().getNombre() + " " + tutoria.getTutor().getApellido()).trim();
                        dto.setNombreTutor(nombreTutor);
                    }
                });
            }
        });

        // Obtener el nombre del estudiante
        usuarioRepository.findById(reserva.getIdEstudiante()).ifPresent(estudiante -> {
            String nombreCompleto = (estudiante.getNombre() + " " + estudiante.getApellido()).trim();
            dto.setNombreEstudiante(nombreCompleto.isEmpty() ? "Estudiante ID: " + reserva.getIdEstudiante() : nombreCompleto);
        });

        // Obtener el nombre del estado
        if (reserva.getEstadoReserva() != null) {
            dto.setNombreEstado(reserva.getEstadoReserva().getNombre());
        } else {
            EstadoReserva estado = estadoReservaRepository.findById(reserva.getIdEstado()).orElse(null);
            if (estado != null) {
                dto.setNombreEstado(estado.getNombre());
            }
        }

        return dto;
    }

    /**
     * Versión optimizada que usa las relaciones ya cargadas por JOIN FETCH
     * Evita N+1 queries
     */
    private ReservaResponseDto convertirAResponseDtoOptimizado(Reserva reserva) {
        ReservaResponseDto dto = new ReservaResponseDto();
        dto.setIdReserva(reserva.getIdReserva());
        dto.setIdDisponibilidad(reserva.getIdDisponibilidad());
        dto.setIdEstudiante(reserva.getIdEstudiante());
        dto.setIdEstado(reserva.getIdEstado());
        dto.setObservaciones(reserva.getObservaciones());
        dto.setFechaCreacion(reserva.getFechaCreacion());
        dto.setFechaCancelacion(reserva.getFechaCancelacion());
        dto.setRazonCancelacion(reserva.getRazonCancelacion());
        dto.setHoraInicio(reserva.getHoraInicio());
        dto.setHoraFin(reserva.getHoraFin());

        // Usar relaciones ya cargadas (no hace queries adicionales)
        if (reserva.getEstudiante() != null) {
            String nombreCompleto = (reserva.getEstudiante().getNombre() + " " + reserva.getEstudiante().getApellido()).trim();
            dto.setNombreEstudiante(nombreCompleto);
        }

        if (reserva.getEstadoReserva() != null) {
            dto.setNombreEstado(reserva.getEstadoReserva().getNombre());
        }

        // Obtener disponibilidad con sus relaciones
        disponibilidadRepository.findById(reserva.getIdDisponibilidad()).ifPresent(disponibilidad -> {
            dto.setDisponibilidadHoraInicio(disponibilidad.getHoraInicio().toLocalTime());
            dto.setDisponibilidadHoraFin(disponibilidad.getHoraFin().toLocalTime());
            
            // Obtener tutoría con sus relaciones
            if (disponibilidad.getIdTutoria() != null) {
                tutoriaRepository.findById(disponibilidad.getIdTutoria()).ifPresent(tutoria -> {
                    if (tutoria.getAsignatura() != null) {
                        dto.setNombreAsignatura(tutoria.getAsignatura().getNombre());
                    }
                    if (tutoria.getTutor() != null) {
                        String nombreTutor = (tutoria.getTutor().getNombre() + " " + tutoria.getTutor().getApellido()).trim();
                        dto.setNombreTutor(nombreTutor);
                    }
                });
            }
        });

        return dto;
    }
}
