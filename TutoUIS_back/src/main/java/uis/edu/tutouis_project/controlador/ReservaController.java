package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.modelo.dto.CreateReservaDto;
import uis.edu.tutouis_project.modelo.dto.UpdateReservaDto;
import uis.edu.tutouis_project.modelo.dto.ReservaResponseDto;
import uis.edu.tutouis_project.servicio.IReservaService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
@Tag(name = "reserva-controller", description = "CRUD de Reservas - Requiere autenticación")
public class ReservaController {

    @Autowired
    private IReservaService reservaService;

    @Operation(summary = "Listar todas las reservas", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de reservas obtenida exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/list")
    public ResponseEntity<List<Reserva>> listarReservas() {
        try {
            List<Reserva> reservas = reservaService.obtenerTodasLasReservas();
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Obtener reserva por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva encontrada"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerReserva(@PathVariable Integer id) {
        try {
            Reserva reserva = reservaService.obtenerReservaPorId(id);
            return ResponseEntity.ok(reserva);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Obtener mis reservas", description = "Requiere autenticación - Obtiene reservas del estudiante autenticado")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reservas obtenidas exitosamente"),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/estudiante/{idUsuario}")
    public ResponseEntity<?> misReservas(@PathVariable Integer idUsuario) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasPorUsuario(idUsuario);
            return ResponseEntity.ok(reservas);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Obtener reservas activas del estudiante", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reservas activas obtenidas"),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/estudiante/{idUsuario}/activas")
    public ResponseEntity<?> reservasActivas(@PathVariable Integer idUsuario) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasActivasDeUsuario(idUsuario);
            return ResponseEntity.ok(reservas);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Obtener reservas por disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reservas obtenidas"),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @GetMapping("/disponibilidad/{idDisponibilidad}")
    public ResponseEntity<?> listarPorDisponibilidad(@PathVariable Integer idDisponibilidad) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasPorDisponibilidad(idDisponibilidad);
            return ResponseEntity.ok(reservas);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Crear nueva reserva", description = "Requiere autenticación. Decrementa aforo disponible")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Reserva creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o validación fallida"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/")
    public ResponseEntity<?> crearReserva(@Valid @RequestBody CreateReservaDto createDto) {
        try {
            ReservaResponseDto nuevaReserva = reservaService.crearReserva(createDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al crear reserva: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Actualizar reserva", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva actualizada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReserva(@PathVariable Integer id, 
                                               @Valid @RequestBody UpdateReservaDto updateDto) {
        try {
            ReservaResponseDto reservaActualizada = reservaService.actualizarReserva(id, updateDto);
            return ResponseEntity.ok(reservaActualizada);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al actualizar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Cancelar reserva", description = "Requiere autenticación. Incrementa aforo disponible")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva cancelada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable Integer id, 
                                             @RequestBody Map<String, String> body) {
        try {
            String razonCancelacion = body.getOrDefault("razonCancelacion", "");
            ReservaResponseDto reservaCancelada = reservaService.cancelarReserva(id, razonCancelacion);
            return ResponseEntity.ok(reservaCancelada);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al cancelar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Marcar reserva como realizada", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva marcada como realizada"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PutMapping("/{id}/realizada")
    public ResponseEntity<?> marcarReservaRealizada(@PathVariable Integer id) {
        try {
            ReservaResponseDto reserva = reservaService.marcarReservaRealizada(id);
            return ResponseEntity.ok(reserva);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Marcar reserva como no asistida", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva marcada como no asistida"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @PutMapping("/{id}/no-asistida")
    public ResponseEntity<?> marcarReservaNoAsistida(@PathVariable Integer id) {
        try {
            ReservaResponseDto reserva = reservaService.marcarReservaNoAsistida(id);
            return ResponseEntity.ok(reserva);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Eliminar reserva", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reserva eliminada"),
        @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Integer id) {
        try {
            reservaService.eliminarReserva(id);
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Reserva eliminada exitosamente");
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al eliminar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
