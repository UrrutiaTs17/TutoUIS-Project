package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.servicio.IDisponibilidadService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disponibilidades")
@CrossOrigin("*")
@Tag(name = "disponibilidad-controller", description = "CRUD de Disponibilidades - Requiere autenticación")
public class DisponibilidadController {

    @Autowired
    private IDisponibilidadService disponibilidadService;

    @Operation(summary = "Listar todas las disponibilidades", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public ResponseEntity<List<Disponibilidad>> listarDisponibilidades() {
        return ResponseEntity.ok(disponibilidadService.listarDisponibilidades());
    }

    @Operation(summary = "Obtener disponibilidad por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/{id}")
    public ResponseEntity<Disponibilidad> obtenerDisponibilidad(@PathVariable Integer id) {
        try {
            Disponibilidad disponibilidad = disponibilidadService.obtenerDisponibilidadPorId(id);
            return ResponseEntity.ok(disponibilidad);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Listar disponibilidades por tutoría", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/tutoria/{idTutoria}")
    public ResponseEntity<List<Disponibilidad>> listarPorTutoria(@PathVariable Integer idTutoria) {
        return ResponseEntity.ok(disponibilidadService.listarPorTutoria(idTutoria));
    }

    @Operation(summary = "Listar disponibilidades por día de la semana", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/dia/{diaSemana}")
    public ResponseEntity<List<Disponibilidad>> listarPorDiaSemana(@PathVariable String diaSemana) {
        return ResponseEntity.ok(disponibilidadService.listarPorDiaSemana(diaSemana));
    }

    @Operation(summary = "Listar disponibilidades por estado", description = "Requiere autenticación (1=Activa, 2=Inactiva, 3=Cancelada)")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/estado/{idEstado}")
    public ResponseEntity<List<Disponibilidad>> listarPorEstado(@PathVariable Integer idEstado) {
        return ResponseEntity.ok(disponibilidadService.listarPorEstado(idEstado));
    }

    @Operation(summary = "Listar disponibilidades activas", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/activas")
    public ResponseEntity<List<Disponibilidad>> listarActivas() {
        return ResponseEntity.ok(disponibilidadService.listarPorEstado(1));
    }

    @Operation(summary = "Listar disponibilidades por tutoría y estado", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/tutoria/{idTutoria}/estado/{idEstado}")
    public ResponseEntity<List<Disponibilidad>> listarPorTutoriaYEstado(
            @PathVariable Integer idTutoria, 
            @PathVariable Integer idEstado) {
        return ResponseEntity.ok(disponibilidadService.listarPorTutoriaYEstado(idTutoria, idEstado));
    }

    @Operation(summary = "Crear disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<?> crearDisponibilidad(@RequestBody Disponibilidad disponibilidad) {
        try {
            Disponibilidad nueva = disponibilidadService.crearDisponibilidad(disponibilidad);
            return ResponseEntity.ok(nueva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Actualizar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDisponibilidad(
            @PathVariable Integer id, 
            @RequestBody Disponibilidad disponibilidad) {
        try {
            Disponibilidad actualizada = disponibilidadService.actualizarDisponibilidad(id, disponibilidad);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Cancelar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarDisponibilidad(
            @PathVariable Integer id, 
            @RequestBody Map<String, String> payload) {
        try {
            String razon = payload.get("razonCancelacion");
            if (razon == null || razon.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La razón de cancelación es obligatoria"));
            }
            Disponibilidad cancelada = disponibilidadService.cancelarDisponibilidad(id, razon);
            return ResponseEntity.ok(cancelada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Eliminar disponibilidad", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDisponibilidad(@PathVariable Integer id) {
        try {
            disponibilidadService.eliminarDisponibilidad(id);
            return ResponseEntity.ok(Map.of("mensaje", "Disponibilidad eliminada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
