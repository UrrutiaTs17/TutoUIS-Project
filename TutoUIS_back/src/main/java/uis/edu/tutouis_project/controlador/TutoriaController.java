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
            System.out.println("🔵 TutoriaController.crearTutoria - Datos recibidos:");
            System.out.println("   idTutor: " + tutoria.getIdTutor());
            System.out.println("   idAsignatura: " + tutoria.getIdAsignatura());
            System.out.println("   modalidad: " + tutoria.getModalidad());
            System.out.println("   lugar: " + tutoria.getLugar());
            System.out.println("   descripcion: " + tutoria.getDescripcion());
            System.out.println("   capacidadMaxima: " + tutoria.getCapacidadMaxima());
            System.out.println("   estado: " + tutoria.getEstado());
            
            Tutoria nueva = tutoriaRepository.save(tutoria);
            System.out.println("✅ Tutoría guardada exitosamente con ID: " + nueva.getIdTutoria());
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            System.err.println("❌ Error guardando tutoría: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Crear tutoría con disponibilidades", description = "Crea una tutoría y sus disponibilidades en una transacción. Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/con-disponibilidades")
    public ResponseEntity<?> crearTutoriaConDisponibilidades(@RequestBody uis.edu.tutouis_project.dto.CrearTutoriaConDisponibilidadDto dto) {
        try {
            System.out.println("🔵 TutoriaController.crearTutoriaConDisponibilidades - Datos recibidos:");
            System.out.println("   idTutor: " + dto.getIdTutor());
            System.out.println("   idAsignatura: " + dto.getIdAsignatura());
            System.out.println("   disponibilidades: " + (dto.getDisponibilidades() != null ? dto.getDisponibilidades().size() : 0));
            
            Tutoria tutoriaCreada = tutoriaService.crearTutoriaConDisponibilidades(dto);
            System.out.println("✅ Tutoría con disponibilidades guardada exitosamente con ID: " + tutoriaCreada.getIdTutoria());
            return ResponseEntity.ok(tutoriaCreada);
        } catch (Exception e) {
            System.err.println("❌ Error guardando tutoría con disponibilidades: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
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

    @Operation(summary = "Actualizar campos editables de tutoría", description = "Actualiza solo descripción, ubicación y disponibilidades. Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}/editable")
    public ResponseEntity<?> actualizarTutoriaEditable(@PathVariable Integer id, @RequestBody java.util.Map<String, Object> datos) {
        try {
            System.out.println("📝 TutoriaController.actualizarTutoriaEditable - ID: " + id);
            System.out.println("   Datos recibidos: " + datos);
            
            Tutoria tutoriaActualizada = tutoriaService.actualizarTutoriaEditable(id, datos);
            System.out.println("✅ Tutoría actualizada exitosamente");
            return ResponseEntity.ok(tutoriaActualizada);
        } catch (RuntimeException e) {
            System.err.println("❌ Error actualizando tutoría: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar tutoría", description = "Elimina una tutoría junto con sus disponibilidades y reservas asociadas. Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTutoria(@PathVariable Integer id) {
        try {
            System.out.println("🗑️ TutoriaController.eliminarTutoria - Eliminando tutoría ID: " + id);
            tutoriaService.eliminarTutoriaConDependencias(id);
            System.out.println("✅ Tutoría eliminada exitosamente con todas sus dependencias");
            return ResponseEntity.ok().body("Tutoría eliminada junto con sus disponibilidades y reservas");
        } catch (RuntimeException e) {
            System.err.println("❌ Error eliminando tutoría: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
