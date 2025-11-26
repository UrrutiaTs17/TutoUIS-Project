package uis.edu.tutouis_project.servicio.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.modelo.dto.DashboardStatsDto;
import uis.edu.tutouis_project.repositorio.ReservaRepository;
import uis.edu.tutouis_project.servicio.IReporteService;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService implements IReporteService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        List<Reserva> reservas = reservaRepository.findAll();

        long total = reservas.size();
        long completadas = reservas.stream().filter(r -> r.getIdEstado() == 3).count(); 
        long pendientes = reservas.stream().filter(r -> r.getIdEstado() == 1).count(); 
        long canceladas = reservas.stream().filter(r -> r.getIdEstado() == 4).count(); 
        long estudiantesActivos = reservas.stream().map(Reserva::getIdEstudiante).distinct().count();

        DashboardStatsDto.GeneralStatsDto stats = new DashboardStatsDto.GeneralStatsDto(
            total, completadas, pendientes, canceladas, estudiantesActivos
        );

        double asistencia = total > 0 ? (double) completadas / total * 100 : 0;
        double tiempoPromedio = calcularTiempoPromedio(reservas);
        double crecimiento = calcularCrecimiento(reservas);
        
        DashboardStatsDto.MetricsDto metrics = new DashboardStatsDto.MetricsDto(
            tiempoPromedio, 
            Math.round(asistencia * 10.0) / 10.0,
            crecimiento
        );

        // Reservas por día de la semana (análisis de todas las reservas)
        List<DashboardStatsDto.ReservaDiaDto> reservasPorDia = calcularReservasPorDia(reservas);

        // Materias Detalle
        List<DashboardStatsDto.MateriaStatsDto> materiasDetalle = calcularMateriasDetalle(reservas);

        // Horarios Pico basados en datos reales
        List<DashboardStatsDto.HorarioPicoDto> horariosPico = calcularHorariosPico(reservas);

        return new DashboardStatsDto(stats, metrics, reservasPorDia, materiasDetalle, horariosPico);
    }

    private double calcularTiempoPromedio(List<Reserva> reservas) {
        if (reservas.isEmpty()) return 0.0;
        
        long totalMinutos = 0;
        int count = 0;
        
        for (Reserva r : reservas) {
            if (r.getDisponibilidad() != null && 
                r.getDisponibilidad().getHoraInicio() != null && 
                r.getDisponibilidad().getHoraFin() != null) {
                
                LocalTime inicio = r.getDisponibilidad().getHoraInicio().toLocalTime();
                LocalTime fin = r.getDisponibilidad().getHoraFin().toLocalTime();
                long minutos = ChronoUnit.MINUTES.between(inicio, fin);
                totalMinutos += minutos;
                count++;
            }
        }
        
        return count > 0 ? Math.round((double) totalMinutos / count * 10.0) / 10.0 : 0.0;
    }

    private double calcularCrecimiento(List<Reserva> reservas) {
        LocalDate hoy = LocalDate.now();
        LocalDate mesAnterior = hoy.minusMonths(1);
        
        long reservasEsteMes = reservas.stream()
            .filter(r -> r.getFechaCreacion() != null)
            .filter(r -> {
                LocalDate fecha = r.getFechaCreacion().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
                return !fecha.isBefore(mesAnterior);
            })
            .count();
            
        long reservasMesAnterior = reservas.stream()
            .filter(r -> r.getFechaCreacion() != null)
            .filter(r -> {
                LocalDate fecha = r.getFechaCreacion().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
                return fecha.isBefore(mesAnterior) && !fecha.isBefore(mesAnterior.minusMonths(1));
            })
            .count();
            
        if (reservasMesAnterior == 0) return reservasEsteMes > 0 ? 100.0 : 0.0;
        
        double crecimiento = ((double) (reservasEsteMes - reservasMesAnterior) / reservasMesAnterior) * 100;
        return Math.round(crecimiento * 10.0) / 10.0;
    }

    private List<DashboardStatsDto.ReservaDiaDto> calcularReservasPorDia(List<Reserva> reservas) {
        Map<DayOfWeek, Long> reservasPorDiaSemana = new HashMap<>();
        
        // Inicializar todos los días en 0
        for (DayOfWeek day : DayOfWeek.values()) {
            reservasPorDiaSemana.put(day, 0L);
        }
        
        // Contar reservas por día de la semana
        for (Reserva r : reservas) {
            if (r.getDisponibilidad() != null && r.getDisponibilidad().getFecha() != null) {
                LocalDate fecha = r.getDisponibilidad().getFecha().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
                DayOfWeek dia = fecha.getDayOfWeek();
                reservasPorDiaSemana.put(dia, reservasPorDiaSemana.get(dia) + 1);
            }
        }
        
        // Convertir a lista con nombres en español
        List<DashboardStatsDto.ReservaDiaDto> resultado = new ArrayList<>();
        String[] diasEspanol = {"Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"};
        DayOfWeek[] diasOrden = {
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, 
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
        };
        
        for (int i = 0; i < diasOrden.length; i++) {
            resultado.add(new DashboardStatsDto.ReservaDiaDto(
                diasEspanol[i], 
                reservasPorDiaSemana.get(diasOrden[i])
            ));
        }
        
        return resultado;
    }

    private List<DashboardStatsDto.MateriaStatsDto> calcularMateriasDetalle(List<Reserva> reservas) {
        Map<String, List<Reserva>> porMateria = new HashMap<>();
        
        for (Reserva r : reservas) {
             if (r.getDisponibilidad() != null && 
                 r.getDisponibilidad().getTutoria() != null && 
                 r.getDisponibilidad().getTutoria().getAsignatura() != null) {
                 String nombre = r.getDisponibilidad().getTutoria().getAsignatura().getNombre();
                 porMateria.computeIfAbsent(nombre, k -> new ArrayList<>()).add(r);
             }
        }
        
        List<DashboardStatsDto.MateriaStatsDto> materiasDetalle = new ArrayList<>();
        for (Map.Entry<String, List<Reserva>> entry : porMateria.entrySet()) {
            String nombre = entry.getKey();
            List<Reserva> rs = entry.getValue();
            long mTotal = rs.size();
            long mCompletadas = rs.stream().filter(r -> r.getIdEstado() == 3).count();
            long mPendientes = rs.stream().filter(r -> r.getIdEstado() == 1).count();
            long mCanceladas = rs.stream().filter(r -> r.getIdEstado() == 4).count();
            double tasa = mTotal > 0 ? (double) mCompletadas / mTotal * 100 : 0;
            
            String codigo = "MAT-" + rs.get(0).getDisponibilidad().getTutoria().getAsignatura().getIdAsignatura();

            materiasDetalle.add(new DashboardStatsDto.MateriaStatsDto(
                nombre, codigo, mTotal, mCompletadas, mPendientes, mCanceladas, 
                Math.round(tasa * 10.0) / 10.0
            ));
        }
        
        // Ordenar por total de reservas descendente
        materiasDetalle.sort((a, b) -> Long.compare(b.getTotal(), a.getTotal()));
        
        return materiasDetalle;
    }

    private List<DashboardStatsDto.HorarioPicoDto> calcularHorariosPico(List<Reserva> reservas) {
        Map<String, Long> reservasPorHorario = new HashMap<>();
        
        for (Reserva r : reservas) {
            if (r.getDisponibilidad() != null && r.getDisponibilidad().getHoraInicio() != null) {
                LocalTime hora = r.getDisponibilidad().getHoraInicio().toLocalTime();
                int horaInt = hora.getHour();
                
                String periodo = obtenerPeriodoHorario(horaInt);
                reservasPorHorario.put(periodo, reservasPorHorario.getOrDefault(periodo, 0L) + 1);
            }
        }
        
        List<DashboardStatsDto.HorarioPicoDto> horariosPico = new ArrayList<>();
        for (Map.Entry<String, Long> entry : reservasPorHorario.entrySet()) {
            String descripcion = obtenerDescripcionPeriodo(entry.getKey());
            horariosPico.add(new DashboardStatsDto.HorarioPicoDto(
                entry.getKey(), descripcion, entry.getValue()
            ));
        }
        
        // Ordenar por cantidad de reservas descendente
        horariosPico.sort((a, b) -> Long.compare(b.getReservas(), a.getReservas()));
        
        // Tomar solo los top 5
        return horariosPico.stream().limit(5).collect(Collectors.toList());
    }

    private String obtenerPeriodoHorario(int hora) {
        int horaInicio = (hora / 2) * 2;
        int horaFin = horaInicio + 2;
        return String.format("%02d:00 - %02d:00", horaInicio, horaFin);
    }

    private String obtenerDescripcionPeriodo(String periodo) {
        int hora = Integer.parseInt(periodo.split(":")[0]);
        if (hora >= 6 && hora < 12) return "Mañana";
        if (hora >= 12 && hora < 18) return "Tarde";
        return "Noche";
    }
}
