package uis.edu.tutouis_project.modelo.dto;

import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private GeneralStatsDto stats;
    private MetricsDto metrics;
    private List<ReservaDiaDto> reservasPorDia;
    private List<MateriaStatsDto> materiasDetalle;
    private List<HorarioPicoDto> horariosPico;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GeneralStatsDto {
        private long totalReservas;
        private long reservasCompletadas;
        private long reservasPendientes;
        private long reservasCanceladas;
        private long estudiantesActivos;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MetricsDto {
        private double tiempoPromedio;
        private double asistencia;
        private double crecimiento;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReservaDiaDto {
        private String label;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MateriaStatsDto {
        private String nombre;
        private String codigo;
        private long total;
        private long completadas;
        private long pendientes;
        private long canceladas;
        private double tasaExito;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HorarioPicoDto {
        private String periodo;
        private String descripcion;
        private long reservas;
    }
}
