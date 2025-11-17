package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uis.edu.tutouis_project.dto.TutoriaResponseDto;
import uis.edu.tutouis_project.modelo.Asignatura;
import uis.edu.tutouis_project.modelo.Tutoria;
import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.repositorio.AsignaturaRepository;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;
import uis.edu.tutouis_project.repositorio.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutoriaService {

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    /**
     * Obtiene todas las tutorías con información completa (nombre tutor, nombre asignatura)
     */
    public List<TutoriaResponseDto> obtenerTodasLasTutorias() {
        System.out.println("🔵 TutoriaService: Iniciando obtenerTodasLasTutorias()");
        List<Tutoria> tutorias = tutoriaRepository.findAll();
        System.out.println("📊 TutoriaService: Se encontraron " + tutorias.size() + " tutorías en la BD");
        
        List<TutoriaResponseDto> resultado = tutorias.stream()
                .map(this::convertirATutoriaResponseDto)
                .collect(Collectors.toList());
        
        System.out.println("✅ TutoriaService: Se convirtieron " + resultado.size() + " tutorías a DTO");
        return resultado;
    }

    /**
     * Convierte una entidad Tutoria a TutoriaResponseDto con información completa
     */
    private TutoriaResponseDto convertirATutoriaResponseDto(Tutoria tutoria) {
        System.out.println("🔄 TutoriaService: Convirtiendo tutoría ID=" + tutoria.getIdTutoria());
        
        TutoriaResponseDto dto = new TutoriaResponseDto();
        
        dto.setIdTutoria(tutoria.getIdTutoria());
        dto.setIdTutor(tutoria.getIdTutor());
        dto.setIdCarrera(tutoria.getIdAsignatura()); // idAsignatura se mapea a idCarrera para el frontend
        dto.setNombre(tutoria.getDescripcion()); // Usamos descripción como nombre
        dto.setDescripcion(tutoria.getDescripcion());
        dto.setCapacidadMaxima(tutoria.getCapacidadMaxima());
        dto.setUbicacion(tutoria.getLugar());
        dto.setModalidad(tutoria.getModalidad());
        dto.setLugar(tutoria.getLugar());
        dto.setEstado(tutoria.getEstado());
        dto.setFechaCreacion(tutoria.getFechaCreacion());
        dto.setFechaUltimaModificacion(tutoria.getFechaUltimaModificacion());
        
        System.out.println("  📝 Datos básicos: nombre=" + dto.getNombre() + ", capacidad=" + dto.getCapacidadMaxima());
        
        // Obtener nombre del tutor
        if (tutoria.getIdTutor() != null) {
            System.out.println("  🔍 Buscando tutor con ID=" + tutoria.getIdTutor());
            usuarioRepository.findById(tutoria.getIdTutor()).ifPresent(tutor -> {
                String nombreCompleto = (tutor.getNombre() != null ? tutor.getNombre() : "") + 
                                       " " + 
                                       (tutor.getApellido() != null ? tutor.getApellido() : "");
                dto.setNombreTutor(nombreCompleto.trim());
                System.out.println("  ✅ Tutor encontrado: " + nombreCompleto.trim());
            });
            if (dto.getNombreTutor() == null) {
                System.out.println("  ⚠️ No se encontró tutor con ID=" + tutoria.getIdTutor());
            }
        } else {
            System.out.println("  ⚠️ La tutoría no tiene idTutor asignado");
        }
        
        // Obtener nombre de la asignatura (se mapea a nombreCarrera para el frontend)
        if (tutoria.getIdAsignatura() != null) {
            System.out.println("  🔍 Buscando asignatura con ID=" + tutoria.getIdAsignatura());
            asignaturaRepository.findById(tutoria.getIdAsignatura()).ifPresent(asignatura -> {
                dto.setNombreCarrera(asignatura.getNombre()); // nombreAsignatura se envía como nombreCarrera
                System.out.println("  ✅ Asignatura encontrada: " + asignatura.getNombre());
            });
            if (dto.getNombreCarrera() == null) {
                System.out.println("  ⚠️ No se encontró asignatura con ID=" + tutoria.getIdAsignatura());
            }
        } else {
            System.out.println("  ⚠️ La tutoría no tiene idAsignatura asignado");
        }
        
        System.out.println("  ✅ DTO completado: nombreTutor=" + dto.getNombreTutor() + ", nombreCarrera=" + dto.getNombreCarrera());
        return dto;
    }
}
