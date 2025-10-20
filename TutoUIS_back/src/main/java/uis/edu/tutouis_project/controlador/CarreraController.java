package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import uis.edu.tutouis_project.modelo.Carrera;
import uis.edu.tutouis_project.repositorio.CarreraRepository;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
@CrossOrigin("*")
@Tag(name = "carrera-controller", description = "CRUD de Carreras - Requiere autenticación")
public class CarreraController {

    @Autowired
    private CarreraRepository carreraRepository;

    @Operation(summary = "Listar todas las carreras", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list")
    public List<Carrera> listarCarreras() {
        return carreraRepository.findAll();
    }

    @Operation(summary = "Obtener carrera por ID", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @GetMapping("/list/{id}")
    public ResponseEntity<Carrera> obtenerCarrera(@PathVariable Integer id) {
        return carreraRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear nueva carrera", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PostMapping("/")
    public ResponseEntity<Carrera> crearCarrera(@RequestBody Carrera carrera) {
        try {
            Carrera nueva = carreraRepository.save(carrera);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Actualizar carrera", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @PutMapping("/{id}")
    public ResponseEntity<Carrera> actualizarCarrera(@PathVariable Integer id, @RequestBody Carrera carreraActualizada) {
        return carreraRepository.findById(id)
                .map(carrera -> {
                    carrera.setNombre(carreraActualizada.getNombre());
                    carrera.setCodigo(carreraActualizada.getCodigo());
                    carrera.setDescripcion(carreraActualizada.getDescripcion());
                    Carrera actualizada = carreraRepository.save(carrera);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar carrera", description = "Requiere autenticación")
    @SecurityRequirement(name = "bearer-jwt")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCarrera(@PathVariable Integer id) {
        return carreraRepository.findById(id)
                .map(carrera -> {
                    carreraRepository.deleteById(id);
                    return ResponseEntity.ok().body("Carrera eliminada");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
