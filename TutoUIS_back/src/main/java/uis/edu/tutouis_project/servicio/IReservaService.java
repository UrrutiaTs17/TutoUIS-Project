package uis.edu.tutouis_project.servicio;

import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.modelo.dto.CreateReservaDto;
import uis.edu.tutouis_project.modelo.dto.UpdateReservaDto;
import uis.edu.tutouis_project.modelo.dto.ReservaResponseDto;
import java.util.List;

public interface IReservaService {
    
    /**
     * Obtiene todas las reservas del sistema como entidades
     */
    List<Reserva> obtenerTodasLasReservas();
    
    /**
     * Lista todas las reservas del sistema con información completa (DTOs)
     */
    List<ReservaResponseDto> listarTodasLasReservas();
    
    /**
     * Obtiene una reserva por su ID
     */
    Reserva obtenerReservaPorId(Integer idReserva);
    
    /**
     * Obtiene todas las reservas de un estudiante
     */
    List<Reserva> obtenerReservasPorUsuario(Integer idEstudiante);
    
    /**
     * Obtiene todas las reservas de un estudiante con información completa (DTOs)
     */
    List<ReservaResponseDto> obtenerReservasDtosPorUsuario(Integer idEstudiante);
    
    /**
     * Obtiene todas las reservas de una disponibilidad
     */
    List<Reserva> obtenerReservasPorDisponibilidad(Integer idDisponibilidad);

        /**
         * Obtiene todas las reservas de una disponibilidad con detalles completos
         * @param idDisponibilidad ID de la disponibilidad
         * @return Lista de reservas con detalles
         */
        List<ReservaResponseDto> obtenerReservasDtosPorDisponibilidad(Integer idDisponibilidad);
    
    /**
     * Obtiene las reservas de un estudiante filtradas por estado
     */
    List<Reserva> obtenerReservasPorUsuarioYEstado(Integer idEstudiante, Integer idEstado);
    
    /**
     * Obtiene las reservas activas de un estudiante
     */
    List<Reserva> obtenerReservasActivasDeUsuario(Integer idEstudiante);
    
    /**
     * Crea una nueva reserva con validaciones
     */
    ReservaResponseDto crearReserva(CreateReservaDto createDto);
    
    /**
     * Actualiza una reserva existente
     */
    ReservaResponseDto actualizarReserva(Integer idReserva, UpdateReservaDto updateDto);
    
    /**
     * Cancela una reserva
     */
    ReservaResponseDto cancelarReserva(Integer idReserva, String razonCancelacion);
    
    /**
     * Marca una reserva como realizada
     */
    ReservaResponseDto marcarReservaRealizada(Integer idReserva);
    
    /**
     * Marca una reserva como no asistida
     */
    ReservaResponseDto marcarReservaNoAsistida(Integer idReserva);
    
    /**
     * Elimina una reserva
     */
    void eliminarReserva(Integer idReserva);
}
