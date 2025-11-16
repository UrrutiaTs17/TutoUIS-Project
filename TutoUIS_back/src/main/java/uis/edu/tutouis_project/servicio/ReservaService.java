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

    @Override
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
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
        // Validar entrada
        if (createDto == null) {
            throw new IllegalArgumentException("El DTO de creación no puede ser nulo");
        }
        if (createDto.getIdDisponibilidad() == null || createDto.getIdDisponibilidad() <= 0) {
            throw new IllegalArgumentException("El ID de disponibilidad es requerido y debe ser positivo");
        }
        if (createDto.getIdEstudiante() == null || createDto.getIdEstudiante() <= 0) {
            throw new IllegalArgumentException("El ID del estudiante es requerido y debe ser positivo");
        }

        // Verificar que la disponibilidad existe
        Disponibilidad disponibilidad = disponibilidadRepository.findById(createDto.getIdDisponibilidad())
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada con ID: " + createDto.getIdDisponibilidad()));

        // Verificar que hay cupos disponibles
        if (disponibilidad.getAforoDisponible() <= 0) {
            throw new RuntimeException("No hay cupos disponibles en esta tutoría");
        }

        // Verificar que el usuario (estudiante) existe
        usuarioRepository.findById(createDto.getIdEstudiante())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + createDto.getIdEstudiante()));

        // Verificar que el estudiante no tenga una reserva activa en la misma disponibilidad
        List<Reserva> reservasExistentes = reservaRepository.findByIdEstudianteAndIdEstado(createDto.getIdEstudiante(), 1);
        boolean yaReservado = reservasExistentes.stream()
                .anyMatch(r -> r.getIdDisponibilidad().equals(createDto.getIdDisponibilidad()));
        if (yaReservado) {
            throw new RuntimeException("El estudiante ya tiene una reserva activa en esta tutoría");
        }

        // Crear la nueva reserva
        Reserva nuevaReserva = new Reserva();
        nuevaReserva.setIdDisponibilidad(createDto.getIdDisponibilidad());
        nuevaReserva.setIdEstudiante(createDto.getIdEstudiante());
        nuevaReserva.setIdEstado(1); // Reservada
        nuevaReserva.setObservaciones(createDto.getObservaciones());

        Reserva reservaGuardada = reservaRepository.save(nuevaReserva);

        // Actualizar aforo disponible
        disponibilidad.setAforoDisponible(disponibilidad.getAforoDisponible() - 1);
        disponibilidadRepository.save(disponibilidad);

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
}
