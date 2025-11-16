package uis.edu.tutouis_project.controlador;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uis.edu.tutouis_project.modelo.Asignatura;
import uis.edu.tutouis_project.servicio.AsignaturaService;

import java.util.List;

@RestController
@RequestMapping("/api/asignaturas")
@Tag(name = "Asignaturas", description = "API para gestionar asignaturas académicas")
@CrossOrigin(origins = "http://localhost:4200")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    @GetMapping("/list")
    @Operation(summary = "Listar todas las asignaturas")
    public ResponseEntity<List<Asignatura>> obtenerTodasLasAsignaturas() {
        try {
            List<Asignatura> asignaturas = asignaturaService.obtenerTodasLasAsignaturas();
            return ResponseEntity.ok(asignaturas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener asignatura por ID")
    public ResponseEntity<?> obtenerAsignaturaPorId(@PathVariable Integer id) {
        try {
            Asignatura asignatura = asignaturaService.obtenerAsignaturaPorId(id);
            return ResponseEntity.ok(asignatura);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/facultad/{facultad}")
    @Operation(summary = "Obtener asignaturas por facultad")
    public ResponseEntity<?> obtenerAsignaturasPorFacultad(@PathVariable String facultad) {
        try {
            List<Asignatura> asignaturas = asignaturaService.obtenerAsignaturasPorFacultad(facultad);
            return ResponseEntity.ok(asignaturas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar asignaturas por nombre")
    public ResponseEntity<?> buscarAsignaturasPorNombre(@RequestParam String nombre) {
        try {
            List<Asignatura> asignaturas = asignaturaService.buscarAsignaturasPorNombre(nombre);
            return ResponseEntity.ok(asignaturas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/")
    @Operation(summary = "Crear nueva asignatura", description = "Requiere autenticación de administrador")
    public ResponseEntity<?> crearAsignatura(@RequestBody Asignatura asignatura) {
        try {
            Asignatura nuevaAsignatura = asignaturaService.crearAsignatura(asignatura);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsignatura);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar asignatura", description = "Requiere autenticación de administrador")
    public ResponseEntity<?> actualizarAsignatura(@PathVariable Integer id, @RequestBody Asignatura asignatura) {
        try {
            Asignatura asignaturaActualizada = asignaturaService.actualizarAsignatura(id, asignatura);
            return ResponseEntity.ok(asignaturaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar asignatura", description = "Requiere autenticación de administrador")
    public ResponseEntity<?> eliminarAsignatura(@PathVariable Integer id) {
        try {
            asignaturaService.eliminarAsignatura(id);
            return ResponseEntity.ok("Asignatura eliminada exitosamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
