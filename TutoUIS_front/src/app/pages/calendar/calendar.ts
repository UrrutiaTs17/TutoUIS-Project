import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, catchError } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { TutoriaService, Tutoria } from '../../services/tutoria.service';
import { DisponibilidadService, Disponibilidad } from '../../services/disponibilidad.service';

type MateriaCatalogo = {
  id: number;
  nombre: string;
  docente: string;
  cupos: string;
  area?: 'math' | 'phys' | 'prog';
  idTutoria?: number;
  nombreCarrera?: string;
};

type MateriaCelda = {
  nombre: string;
  detalle: string;   // ej: "Arrays • Carlos Ruiz"
  cupos: string;     // ej: "4/6"
  clase?: string;    // ej: "dept-prog" para pintar borde
  tooltip?: string;  // ej: "Laboratorio 3 • 12 semanas"
  idDisponibilidad?: number;
  idTutoria?: number;
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {

  /** Cuando es false, ocultamos el buscador y mostramos directamente el calendario */
  @Input() showSearch: boolean = true;

  // ======== Cabeceras de tabla ========
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = ['6:00 - 8:00', '8:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

  // ======== Buscador ========
  searchControl = new FormControl<string>('', { nonNullable: true });
  suggestions$!: Observable<MateriaCatalogo[]>;
  showDropdown = false;
  activeIndex = 0;
  loading = false;
  error = '';

  // Catálogo de tutorías desde la base de datos
  private tutorias: Tutoria[] = [];
  private disponibilidades: Disponibilidad[] = [];

  // ======== Pintado del horario ========
  // clave: `${hora}__${dia}`
  private schedule = new Map<string, MateriaCelda>();

  // selección de celda (para resaltar/acciones)
  selected: { hora: string; dia: string } | null = null;

  constructor(
    private modalService: ModalService,
    private tutoriaService: TutoriaService,
    private disponibilidadService: DisponibilidadService,
    private cdr: ChangeDetectorRef
  ) {}

  // ======== Ciclo de vida ========
  ngOnInit(): void {
    console.log('📅 CalendarComponent: Inicializando...');
    this.loading = true;
    this.cargarDatos();

    this.suggestions$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(200),
      distinctUntilChanged(),
      map(q => this.filterCatalogo(q || ''))
    );

    // mostrar/ocultar dropdown
    this.suggestions$.subscribe(list => {
      const hasQuery = !!this.searchControl.value?.trim();
      this.showDropdown = hasQuery || list.length > 0;
      this.activeIndex = 0;
    });

    // Timeout de seguridad (15 segundos)
    setTimeout(() => {
      if (this.loading) {
        console.warn('⏱️ CalendarComponent: Timeout alcanzado, deteniendo carga');
        this.loading = false;
        this.error = 'La carga de datos está tomando más tiempo del esperado. Por favor, intenta recargar la página.';
        this.cdr.detectChanges();
      }
    }, 15000);
  }

  /**
   * Carga tutorías y disponibilidades desde la base de datos
   */
  cargarDatos(): void {
    console.log('🔄 CalendarComponent: Cargando tutorías y disponibilidades...');
    
    combineLatest([
      this.tutoriaService.getAllTutorias(),
      this.disponibilidadService.getDisponibilidadesActivas()
    ]).pipe(
      catchError(error => {
        console.error('❌ CalendarComponent: Error al cargar datos:', error);
        this.error = 'Error al cargar las tutorías disponibles. Por favor, intenta de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
        return of([[], []]);
      })
    ).subscribe(([tutorias, disponibilidades]) => {
      console.log('✅ CalendarComponent: Datos cargados -', tutorias.length, 'tutorías,', disponibilidades.length, 'disponibilidades');
      
      this.tutorias = tutorias;
      this.disponibilidades = disponibilidades;
      
      // Construir el horario a partir de las disponibilidades
      this.construirHorario();
      
      this.loading = false;
      this.error = '';
      this.cdr.detectChanges();
    });
  }

  /**
   * Construye el horario a partir de las disponibilidades cargadas
   */
  private construirHorario(): void {
    console.log('🔨 CalendarComponent: Construyendo horario...');
    this.schedule.clear();

    this.disponibilidades.forEach(disp => {
      const tutoria = this.tutorias.find(t => t.idTutoria === disp.idTutoria);
      if (!tutoria) {
        console.warn('⚠️ CalendarComponent: No se encontró tutoría para disponibilidad', disp.idDisponibilidad);
        return;
      }

      const rangoHora = this.obtenerRangoHora(disp.horaInicio, disp.horaFin);
      if (!rangoHora) {
        console.warn('⚠️ CalendarComponent: Rango de hora inválido para disponibilidad', disp.idDisponibilidad);
        return;
      }

      const key = this.key(rangoHora, disp.diaSemana);
      
      const materia: MateriaCelda = {
        nombre: tutoria.nombre || 'Sin nombre',
        detalle: `${tutoria.descripcion || ''} • ${tutoria.nombreTutor || 'Sin tutor'}`,
        cupos: `${disp.aforoDisponible}/${disp.aforoMaximo}`,
        clase: this.obtenerClaseColor(tutoria.nombreCarrera || ''),
        tooltip: `${tutoria.nombreCarrera || 'Sin carrera'} • ${disp.fecha}`,
        idDisponibilidad: disp.idDisponibilidad,
        idTutoria: disp.idTutoria
      };

      this.schedule.set(key, materia);
      console.log('📌 CalendarComponent: Agregado al horario -', key, materia.nombre);
    });

    console.log('✅ CalendarComponent: Horario construido con', this.schedule.size, 'celdas');
  }

  /**
   * Convierte hora de formato HH:mm:ss a rango de hora del calendario
   */
  private obtenerRangoHora(horaInicio: string, horaFin: string): string | null {
    try {
      // Extraer solo la hora (HH) de horaInicio
      const inicio = parseInt(horaInicio.split(':')[0]);
      
      // Buscar el rango correspondiente en this.horas
      for (const rango of this.horas) {
        const [inicioRango] = rango.split(' - ');
        const horaRango = parseInt(inicioRango.split(':')[0]);
        
        if (horaRango === inicio) {
          return rango;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ CalendarComponent: Error al parsear hora:', error);
      return null;
    }
  }

  /**
   * Obtiene una clase CSS según el nombre de la carrera
   */
  private obtenerClaseColor(nombreCarrera: string): string {
    const carrera = nombreCarrera.toLowerCase();
    
    if (carrera.includes('programacion') || carrera.includes('software') || carrera.includes('base') || carrera.includes('datos')) {
      return 'dept-prog';
    } else if (carrera.includes('calculo') || carrera.includes('algebra') || carrera.includes('matematica')) {
      return 'dept-math';
    } else if (carrera.includes('fisica') || carrera.includes('circuito') || carrera.includes('electroni')) {
      return 'dept-phys';
    }
    
    return 'dept-prog'; // default
  }

  // ======== Helpers de tabla ========
  trackHora = (_: number, h: string) => h;
  trackDia  = (_: number, d: string) => d;

  // ✅ trackBy para la lista de sugerencias (Materias del catálogo)
trackMateria = (_: number, m: MateriaCatalogo) => m.id; // o `${m.id}-${m.nombre}`

  private key(hora: string, dia: string) { return `${hora}__${dia}`; }

  getMateria(hora: string, dia: string): MateriaCelda | undefined {
    return this.schedule.get(this.key(hora, dia));
  }

  // Nueva función: solo muestra la materia buscada
  getMateriaFiltrada(hora: string, dia: string): MateriaCelda | undefined {
    const materia = this.getMateria(hora, dia);
    const query = this.searchControl.value?.toLowerCase().trim();
    if (!materia || !query) return undefined;
    // Coincidencia por nombre de materia
    return materia.nombre.toLowerCase().includes(query) ? materia : undefined;
  }

  selectCell(hora: string, dia: string) {
    this.selected = { hora, dia };
    this.modalService.showModal();
  }

  isSelected(hora: string, dia: string): boolean {
    return !!this.selected &&
           this.selected.hora === hora &&
           this.selected.dia === dia;
  }

  // ======== Buscador: lógica con datos reales ========
  private filterCatalogo(q: string): MateriaCatalogo[] {
    const v = q.toLowerCase().trim();
    if (!v) return [];
    
    return this.tutorias
      .filter(tutoria => {
        const nombre = tutoria.nombre || '';
        const tutor = tutoria.nombreTutor || '';
        const carrera = tutoria.nombreCarrera || '';
        
        return nombre.toLowerCase().includes(v) ||
               tutor.toLowerCase().includes(v) ||
               carrera.toLowerCase().includes(v);
      })
      .map(tutoria => {
        // Calcular cupos disponibles totales para esta tutoría
        const disponibilidadesTutoria = this.disponibilidades.filter(d => d.idTutoria === tutoria.idTutoria);
        const cuposDisponibles = disponibilidadesTutoria.reduce((sum, d) => sum + d.aforoDisponible, 0);
        const cuposMaximos = disponibilidadesTutoria.reduce((sum, d) => sum + d.aforoMaximo, 0);
        
        return {
          id: tutoria.idTutoria,
          nombre: tutoria.nombre || 'Sin nombre',
          docente: tutoria.nombreTutor || 'Sin tutor',
          cupos: cuposMaximos > 0 ? `${cuposDisponibles}/${cuposMaximos}` : '0/0',
          idTutoria: tutoria.idTutoria,
          nombreCarrera: tutoria.nombreCarrera
        };
      })
      .slice(0, 8);
  }

  clear() {
    this.searchControl.setValue('');
    this.showDropdown = false;
  }

  select(item: MateriaCatalogo) {
    console.log('✅ CalendarComponent: Tutoría seleccionada:', item);
    // Rellenar el input con el nombre de la tutoría seleccionada
    this.searchControl.setValue(item.nombre);
    this.showDropdown = false;
    this.cdr.detectChanges();
  }

  selectFirst() {
    // Selecciona la primera sugerencia si existe
    this.suggestions$.subscribe(list => {
      if (list.length) this.select(list[0]);
    }).unsubscribe();
  }
}


