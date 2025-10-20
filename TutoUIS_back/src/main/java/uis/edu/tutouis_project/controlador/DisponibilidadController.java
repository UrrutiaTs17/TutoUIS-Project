package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.repositorio.DisponibilidadRepository;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades")
@CrossOrigin("*")
@Tag(name = "disponibilidad-controller", description = "CRUD de Disponibilidades - Requiere autenticación")
public class DisponibilidadController {

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Operation(summary = "Listar todas las disponibilidades", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public List<Disponibilidad> listarDisponibilidades() {
        return disponibilidadRepository.findAll();
    }

    @Operation(summary = "Obtener disponibilidad por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list/{id}")
    public ResponseEntity<Disponibilidad> obtenerDisponibilidad(@PathVariable Integer id) {
        return disponibilidadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar disponibilidades por tutoría", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/tutoria/{idTutoria}")
    public List<Disponibilidad> listarPorTutoria(@PathVariable Integer idTutoria) {
        return disponibilidadRepository.findByIdTutoria(idTutoria);
    }

    @Operation(summary = "Listar disponibilidades por fecha", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/fecha/{fecha}")
    public List<Disponibilidad> listarPorFecha(@PathVariable String fecha) {
        return disponibilidadRepository.findByFecha(Date.valueOf(fecha));
    }

    @Operation(summary = "Listar disponibilidades activas", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/activas")
    public List<Disponibilidad> listarActivas() {
        return disponibilidadRepository.findByEstado(1);
    }

    @Operation(summary = "Crear disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<Disponibilidad> crearDisponibilidad(@RequestBody Disponibilidad disponibilidad) {
        try {
            Disponibilidad nueva = disponibilidadRepository.save(disponibilidad);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Actualizar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<Disponibilidad> actualizarDisponibilidad(@PathVariable Integer id, @RequestBody Disponibilidad disponibilidadActualizada) {
        return disponibilidadRepository.findById(id)
                .map(disponibilidad -> {
                    disponibilidad.setFecha(disponibilidadActualizada.getFecha());
                    disponibilidad.setHoraInicio(disponibilidadActualizada.getHoraInicio());
                    disponibilidad.setHoraFin(disponibilidadActualizada.getHoraFin());
                    disponibilidad.setAforo(disponibilidadActualizada.getAforo());
                    disponibilidad.setEstado(disponibilidadActualizada.getEstado());
                    Disponibilidad actualizada = disponibilidadRepository.save(disponibilidad);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cancelar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Disponibilidad> cancelarDisponibilidad(@PathVariable Integer id, @RequestBody String razonCancelacion) {
        return disponibilidadRepository.findById(id)
                .map(disponibilidad -> {
                    disponibilidad.setEstado(3);
                    disponibilidad.setRazonCancelacion(razonCancelacion);
                    Disponibilidad actualizada = disponibilidadRepository.save(disponibilidad);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDisponibilidad(@PathVariable Integer id) {
        return disponibilidadRepository.findById(id)
                .map(disponibilidad -> {
                    disponibilidadRepository.deleteById(id);
                    return ResponseEntity.ok().body("Disponibilidad eliminada");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
