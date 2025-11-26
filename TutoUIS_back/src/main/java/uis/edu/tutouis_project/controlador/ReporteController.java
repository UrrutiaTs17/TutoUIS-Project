package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uis.edu.tutouis_project.modelo.dto.DashboardStatsDto;
import uis.edu.tutouis_project.servicio.IReporteService;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin("*")
public class ReporteController {

    @Autowired
    private IReporteService reporteService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(reporteService.getDashboardStats());
    }
}
