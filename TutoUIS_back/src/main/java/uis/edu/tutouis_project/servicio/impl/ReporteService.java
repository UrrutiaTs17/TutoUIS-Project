package uis.edu.tutouis_project.servicio.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.modelo.Reserva;
import uis.edu.tutouis_project.modelo.dto.DashboardStatsDto;
import uis.edu.tutouis_project.repositorio.ReservaRepository;
import uis.edu.tutouis_project.servicio.IReporteService;

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
        DashboardStatsDto.MetricsDto metrics = new DashboardStatsDto.MetricsDto(
            45.0, 
            Math.round(asistencia * 10.0) / 10.0,
            15.3 
        );

        // Reservas por dia (Mocked for now as it requires complex date logic)
        List<DashboardStatsDto.ReservaDiaDto> reservasPorDia = new ArrayList<>();
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Lun", 12));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Mar", 19));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Mié", 3));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Jue", 5));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Vie", 2));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Sáb", 3));
        reservasPorDia.add(new DashboardStatsDto.ReservaDiaDto("Dom", 0));

        // Materias Detalle
        Map<String, List<Reserva>> porMateria = new HashMap<>();
        for (Reserva r : reservas) {
             if (r.getDisponibilidad() != null && r.getDisponibilidad().getTutoria() != null && r.getDisponibilidad().getTutoria().getAsignatura() != null) {
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
                nombre, codigo, mTotal, mCompletadas, mPendientes, mCanceladas, Math.round(tasa * 10.0) / 10.0
            ));
        }

        // Horarios Pico (Mocked)
        List<DashboardStatsDto.HorarioPicoDto> horariosPico = new ArrayList<>();
        horariosPico.add(new DashboardStatsDto.HorarioPicoDto("10:00 - 12:00", "Mañana", 15));
        horariosPico.add(new DashboardStatsDto.HorarioPicoDto("14:00 - 16:00", "Tarde", 12));

        return new DashboardStatsDto(stats, metrics, reservasPorDia, materiasDetalle, horariosPico);
    }
}
