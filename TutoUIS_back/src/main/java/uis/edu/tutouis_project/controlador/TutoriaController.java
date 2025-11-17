package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.dto.TutoriaResponseDto;
import uis.edu.tutouis_project.modelo.Tutoria;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;
import uis.edu.tutouis_project.servicio.TutoriaService;

import java.util.List;

@RestController
@RequestMapping("/api/tutorias")
@CrossOrigin("*")
@Tag(name = "tutoria-controller", description = "CRUD de Tutorías - Requiere autenticación")
public class TutoriaController {

    @Autowired
    private TutoriaRepository tutoriaRepository;
    
    @Autowired
    private TutoriaService tutoriaService;

    @Operation(summary = "Listar todas las tutorías", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public List<TutoriaResponseDto> listarTutorias() {
        System.out.println("🔵 TutoriaController: Iniciando listarTutorias()");
        try {
            List<TutoriaResponseDto> tutorias = tutoriaService.obtenerTodasLasTutorias();
            System.out.println("✅ TutoriaController: Se obtuvieron " + tutorias.size() + " tutorías");
            if (!tutorias.isEmpty()) {
                TutoriaResponseDto primera = tutorias.get(0);
                System.out.println("📊 TutoriaController: Primera tutoría: ID=" + primera.getIdTutoria() + 
                                 ", Nombre=" + primera.getNombre() + 
                                 ", Tutor=" + primera.getNombreTutor() + 
                                 ", Carrera=" + primera.getNombreCarrera());
            }
            return tutorias;
        } catch (Exception e) {
            System.err.println("❌ TutoriaController: Error al listar tutorías: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Operation(summary = "Obtener tutoría por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list/{id}")
    public ResponseEntity<Tutoria> obtenerTutoria(@PathVariable Integer id) {
        return tutoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar tutorías por tutor", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/tutor/{idTutor}")
    public List<Tutoria> listarPorTutor(@PathVariable Integer idTutor) {
        return tutoriaRepository.findByIdTutor(idTutor);
    }

    @Operation(summary = "Listar tutorías por asignatura", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/asignatura/{idAsignatura}")
    public List<Tutoria> listarPorAsignatura(@PathVariable Integer idAsignatura) {
        return tutoriaRepository.findByIdAsignatura(idAsignatura);
    }

    @Operation(summary = "Listar tutorías activas", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/activas")
    public List<Tutoria> listarActivas() {
        return tutoriaRepository.findByEstado(1);
    }

    @Operation(summary = "Crear nueva tutoría", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<Tutoria> crearTutoria(@RequestBody Tutoria tutoria) {
        try {
            Tutoria nueva = tutoriaRepository.save(tutoria);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Actualizar tutoría", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<Tutoria> actualizarTutoria(@PathVariable Integer id, @RequestBody Tutoria tutoriaActualizada) {
        return tutoriaRepository.findById(id)
                .map(tutoria -> {
                    tutoria.setIdAsignatura(tutoriaActualizada.getIdAsignatura());
                    tutoria.setModalidad(tutoriaActualizada.getModalidad());
                    tutoria.setLugar(tutoriaActualizada.getLugar());
                    tutoria.setDescripcion(tutoriaActualizada.getDescripcion());
                    tutoria.setCapacidadMaxima(tutoriaActualizada.getCapacidadMaxima());
                    tutoria.setEstado(tutoriaActualizada.getEstado());
                    Tutoria actualizada = tutoriaRepository.save(tutoria);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar tutoría", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTutoria(@PathVariable Integer id) {
        return tutoriaRepository.findById(id)
                .map(tutoria -> {
                    tutoriaRepository.deleteById(id);
                    return ResponseEntity.ok().body("Tutoría eliminada");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
