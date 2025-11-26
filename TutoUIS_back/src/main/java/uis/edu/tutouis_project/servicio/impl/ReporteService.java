package uis.edu.tutouis_project.servicio.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.modelo.dto.DashboardStatsDto;
import uis.edu.tutouis_project.repositorio.ReservaRepository;
import uis.edu.tutouis_project.servicio.IReporteService;

import java.util.*;

@Service
public class ReporteService implements IReporteService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        System.out.println("=== INICIO CARGA DE ESTADÍSTICAS ===");
        long startTime = System.currentTimeMillis();
        
        // 1. Estadísticas generales (optimizado con consulta agregada)
        Map<Integer, Long> reservasPorEstado = new HashMap<>();
        List<Object[]> estadosCounts = reservaRepository.countReservasPorEstado();
        
        long total = 0;
        for (Object[] row : estadosCounts) {
            Integer estado = (Integer) row[0];
            Long count = (Long) row[1];
            reservasPorEstado.put(estado, count);
            total += count;
        }
        
        long completadas = reservasPorEstado.getOrDefault(3, 0L);
        long pendientes = reservasPorEstado.getOrDefault(1, 0L);
        long canceladas = reservasPorEstado.getOrDefault(4, 0L);
        long estudiantesActivos = reservaRepository.countEstudiantesActivos();
        
        DashboardStatsDto.GeneralStatsDto stats = new DashboardStatsDto.GeneralStatsDto(
            total, completadas, pendientes, canceladas, estudiantesActivos
        );
        System.out.println("Estadísticas generales calculadas: " + total + " reservas");
        
        // 2. Métricas (consultas optimizadas)
        Double tiempoPromedioRaw = reservaRepository.calcularTiempoPromedioMinutos();
        double tiempoPromedio = tiempoPromedioRaw != null ? Math.round(tiempoPromedioRaw * 10.0) / 10.0 : 0.0;
        
        double asistencia = total > 0 ? Math.round((double) completadas / total * 100 * 10.0) / 10.0 : 0.0;
        
        Object[] crecimientoData = reservaRepository.calcularCrecimientoMensual();
        double crecimiento = 0.0;
        if (crecimientoData != null && crecimientoData.length == 2) {
            Long mesActual = crecimientoData[0] != null ? ((Number) crecimientoData[0]).longValue() : 0L;
            Long mesAnterior = crecimientoData[1] != null ? ((Number) crecimientoData[1]).longValue() : 0L;
            
            if (mesAnterior > 0) {
                crecimiento = Math.round(((double) (mesActual - mesAnterior) / mesAnterior) * 100 * 10.0) / 10.0;
            } else if (mesActual > 0) {
                crecimiento = 100.0;
            }
        }
        
        DashboardStatsDto.MetricsDto metrics = new DashboardStatsDto.MetricsDto(
            tiempoPromedio, asistencia, crecimiento
        );
        System.out.println("Métricas calculadas - Tiempo promedio: " + tiempoPromedio + " min");
        
        // 3. Reservas por día de la semana (consulta optimizada)
        List<DashboardStatsDto.ReservaDiaDto> reservasPorDia = calcularReservasPorDia();
        System.out.println("Reservas por día calculadas: " + reservasPorDia.size() + " días");
        
        // 4. Materias detalle (consulta optimizada)
        List<DashboardStatsDto.MateriaStatsDto> materiasDetalle = calcularMateriasDetalle();
        System.out.println("Materias calculadas: " + materiasDetalle.size() + " materias");
        
        // 5. Horarios pico (consulta optimizada)
        List<DashboardStatsDto.HorarioPicoDto> horariosPico = calcularHorariosPico();
        System.out.println("Horarios pico calculados: " + horariosPico.size() + " horarios");
        
        long endTime = System.currentTimeMillis();
        System.out.println("=== FIN CARGA DE ESTADÍSTICAS - Tiempo total: " + (endTime - startTime) + " ms ===");
        
        return new DashboardStatsDto(stats, metrics, reservasPorDia, materiasDetalle, horariosPico);
    }

    private List<DashboardStatsDto.ReservaDiaDto> calcularReservasPorDia() {
        List<Object[]> resultados = reservaRepository.countReservasPorDiaSemana();
        
        // Inicializar array con todos los días en 0
        Map<Integer, Long> reservasPorDiaSemana = new HashMap<>();
        for (int i = 1; i <= 7; i++) {
            reservasPorDiaSemana.put(i, 0L);
        }
        
        // Llenar con datos reales
        for (Object[] row : resultados) {
            Integer dia = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            reservasPorDiaSemana.put(dia, count);
        }
        
        // MySQL DAYOFWEEK: 1=Domingo, 2=Lunes, ..., 7=Sábado
        // Necesitamos: Lun, Mar, Mié, Jue, Vie, Sáb, Dom
        String[] diasEspanol = {"Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"};
        int[] diasMySQL = {2, 3, 4, 5, 6, 7, 1}; // Lunes a Domingo en formato MySQL
        
        List<DashboardStatsDto.ReservaDiaDto> resultado = new ArrayList<>();
        for (int i = 0; i < diasEspanol.length; i++) {
            resultado.add(new DashboardStatsDto.ReservaDiaDto(
                diasEspanol[i], 
                reservasPorDiaSemana.get(diasMySQL[i])
            ));
        }
        
        return resultado;
    }

    private List<DashboardStatsDto.MateriaStatsDto> calcularMateriasDetalle() {
        List<Object[]> resultados = reservaRepository.findEstadisticasPorMateria();
        
        List<DashboardStatsDto.MateriaStatsDto> materiasDetalle = new ArrayList<>();
        for (Object[] row : resultados) {
            String nombre = (String) row[0];
            String codigo = (String) row[1];
            long mTotal = ((Number) row[2]).longValue();
            long mCompletadas = ((Number) row[3]).longValue();
            long mPendientes = ((Number) row[4]).longValue();
            long mCanceladas = ((Number) row[5]).longValue();
            double tasa = mTotal > 0 ? Math.round((double) mCompletadas / mTotal * 100 * 10.0) / 10.0 : 0.0;

            materiasDetalle.add(new DashboardStatsDto.MateriaStatsDto(
                nombre, codigo, mTotal, mCompletadas, mPendientes, mCanceladas, tasa
            ));
        }
        
        return materiasDetalle;
    }

    private List<DashboardStatsDto.HorarioPicoDto> calcularHorariosPico() {
        List<Object[]> resultados = reservaRepository.findHorariosPico();
        
        List<DashboardStatsDto.HorarioPicoDto> horariosPico = new ArrayList<>();
        for (Object[] row : resultados) {
            String periodo = (String) row[0];
            String descripcion = (String) row[1];
            long reservas = ((Number) row[2]).longValue();
            
            horariosPico.add(new DashboardStatsDto.HorarioPicoDto(
                periodo, descripcion, reservas
            ));
        }
        
        return horariosPico;
    }
}
