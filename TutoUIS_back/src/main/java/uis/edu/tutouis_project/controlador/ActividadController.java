package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import uis.edu.tutouis_project.modelo.dto.ActividadRecienteDto;
import uis.edu.tutouis_project.servicio.IActividadService;

import java.util.List;

@RestController
@RequestMapping("/api/actividad")
@CrossOrigin("*")
@Tag(name = "actividad-controller", description = "Endpoints para actividad reciente del sistema")
public class ActividadController {

    @Autowired
    private IActividadService actividadService;

    @Operation(summary = "Obtener actividad reciente", 
               description = "Retorna las últimas actividades del sistema (usuarios, tutorías, reservas) ordenadas por fecha")
    @GetMapping("/reciente")
    public List<ActividadRecienteDto> obtenerActividadReciente(
            @RequestParam(defaultValue = "10") int limite) {
        return actividadService.obtenerActividadReciente(limite);
    }
}
