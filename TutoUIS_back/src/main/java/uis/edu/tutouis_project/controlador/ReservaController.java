package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.repositorio.ReservaRepository;
import uis.edu.tutouis_project.repositorio.DisponibilidadRepository;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
@Tag(name = "reserva-controller", description = "CRUD de Reservas - Requiere autenticación")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Operation(summary = "Listar todas las reservas", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    @Operation(summary = "Obtener reserva por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list/{id}")
    public ResponseEntity<Reserva> obtenerReserva(@PathVariable Integer id) {
        return reservaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar mis reservas", description = "Requiere autenticación - Obtiene reservas del usuario autenticado")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/mis-reservas/{idEstudiante}")
    public List<Reserva> misReservas(@PathVariable Integer idEstudiante) {
        return reservaRepository.findByIdEstudiante(idEstudiante);
    }

    @Operation(summary = "Listar reservas de una disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/disponibilidad/{idDisponibilidad}")
    public List<Reserva> listarPorDisponibilidad(@PathVariable Integer idDisponibilidad) {
        return reservaRepository.findByIdDisponibilidad(idDisponibilidad);
    }

    @Operation(summary = "Crear nueva reserva", description = "Requiere autenticación. Decrementa aforo disponible")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        try {
            // Validar que hay espacio disponible
            var disponibilidad = disponibilidadRepository.findById(reserva.getIdDisponibilidad());
            if (disponibilidad.isEmpty()) {
                return ResponseEntity.badRequest().body("Disponibilidad no existe");
            }

            if (disponibilidad.get().getAforoDisponible() <= 0) {
                return ResponseEntity.badRequest().body("No hay cupos disponibles");
            }

            // Crear reserva
            reserva.setIdEstado(1); // Reservada
            Reserva nueva = reservaRepository.save(reserva);

            // Actualizar aforo disponible
            var disp = disponibilidad.get();
            disp.setAforoDisponible(disp.getAforoDisponible() - 1);
            disponibilidadRepository.save(disp);

            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear reserva: " + e.getMessage());
        }
    }

    @Operation(summary = "Cancelar reserva", description = "Requiere autenticación. Incrementa aforo disponible")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable Integer id, @RequestBody String razonCancelacion) {
        try {
            return reservaRepository.findById(id)
                    .map(reserva -> {
                        reserva.setIdEstado(2); // Cancelada
                        reserva.setRazonCancelacion(razonCancelacion);
                        Reserva actualizada = reservaRepository.save(reserva);

                        // Incrementar aforo disponible
                        var disponibilidad = disponibilidadRepository.findById(reserva.getIdDisponibilidad());
                        if (disponibilidad.isPresent()) {
                            var disp = disponibilidad.get();
                            disp.setAforoDisponible(disp.getAforoDisponible() + 1);
                            disponibilidadRepository.save(disp);
                        }

                        return ResponseEntity.ok(actualizada);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cancelar: " + e.getMessage());
        }
    }

    @Operation(summary = "Actualizar reserva", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<Reserva> actualizarReserva(@PathVariable Integer id, @RequestBody Reserva reservaActualizada) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    reserva.setObservaciones(reservaActualizada.getObservaciones());
                    Reserva actualizada = reservaRepository.save(reserva);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar reserva", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Integer id) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    reservaRepository.deleteById(id);
                    return ResponseEntity.ok().body("Reserva eliminada");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
