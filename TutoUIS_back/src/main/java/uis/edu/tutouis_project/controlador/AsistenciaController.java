package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.modelo.Asistencia;
import uis.edu.tutouis_project.repositorio.AsistenciaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin("*")
@Tag(name = "asistencia-controller", description = "CRUD de Asistencias - Requiere autenticación")
public class AsistenciaController {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Operation(summary = "Listar todas las asistencias", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public List<Asistencia> listarAsistencias() {
        return asistenciaRepository.findAll();
    }

    @Operation(summary = "Obtener asistencia por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list/{id}")
    public ResponseEntity<Asistencia> obtenerAsistencia(@PathVariable Integer id) {
        return asistenciaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar asistencias por reserva", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/reserva/{idReserva}")
    public List<Asistencia> listarPorReserva(@PathVariable Integer idReserva) {
        return asistenciaRepository.findByIdReserva(idReserva);
    }

    @Operation(summary = "Listar asistencias registradas por un tutor", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/tutor/{idTutor}")
    public List<Asistencia> listarPorTutor(@PathVariable Integer idTutor) {
        return asistenciaRepository.findByIdTutor(idTutor);
    }

    @Operation(summary = "Registrar asistencia", description = "Requiere autenticación - Solo tutores pueden registrar")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<Asistencia> registrarAsistencia(@RequestBody Asistencia asistencia) {
        try {
            Asistencia nueva = asistenciaRepository.save(asistencia);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Actualizar asistencia", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<Asistencia> actualizarAsistencia(@PathVariable Integer id, @RequestBody Asistencia asistenciaActualizada) {
        return asistenciaRepository.findById(id)
                .map(asistencia -> {
                    asistencia.setIdEstado(asistenciaActualizada.getIdEstado());
                    asistencia.setObservaciones(asistenciaActualizada.getObservaciones());
                    Asistencia actualizada = asistenciaRepository.save(asistencia);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar asistencia", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAsistencia(@PathVariable Integer id) {
        return asistenciaRepository.findById(id)
                .map(asistencia -> {
                    asistenciaRepository.deleteById(id);
                    return ResponseEntity.ok().body("Asistencia eliminada");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
