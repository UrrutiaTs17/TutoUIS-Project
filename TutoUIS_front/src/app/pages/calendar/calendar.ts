import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, catchError, finalize } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { TutoriaService, Tutoria } from '../../services/tutoria.service';
import { DisponibilidadService, Disponibilidad } from '../../services/disponibilidad.service';
import { ReservationService, CreateReservaDto, Reserva } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

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

export interface CalendarStats {
  disponibles: number;
  tutores: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {

  /** Cuando es false, ocultamos el buscador y mostramos directamente el calendario */
  @Input() showSearch: boolean = true;

  /** ID del tutor para filtrar solo sus disponibilidades (opcional) */
  @Input() tutorId?: number;

  /** Emite las estadísticas cuando los datos se cargan */
  @Output() statsLoaded = new EventEmitter<CalendarStats>();

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
  
  // Modal de slots de 15 minutos
  showSlotModal = false;
  showReservationsModal = false;
  selectedDisponibilidad: Disponibilidad | null = null;
  selectedTutoria: Tutoria | null = null;
  loadingReservations = false;
  reservationsError = '';
  reservationsForSlot: Reserva[] = [];
  availableSlots: { inicio: string; fin: string; display: string }[] = [];
  selectedSlot: { inicio: string; fin: string } | null = null;
  observaciones = '';
  creandoReserva = false;
  errorMessage = '';

  constructor(
    private modalService: ModalService,
    private tutoriaService: TutoriaService,
    private disponibilidadService: DisponibilidadService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ======== Ciclo de vida ========
  ngOnInit(): void {
    console.log('📅 CalendarComponent: Inicializando...');
    console.log('📅 CalendarComponent: showSearch =', this.showSearch);
    console.log('📅 CalendarComponent: tutorId =', this.tutorId);
    console.log('📅 CalendarComponent: ¿statsLoaded tiene observers?', this.statsLoaded.observers.length);
    
    this.loading = true;
    this.error = ''; // Limpiar errores previos
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
  }

  /**
   * Carga tutorías y disponibilidades desde la base de datos
   * Optimizado para cargar en paralelo y manejar errores sin bloquear
   */
  cargarDatos(): void {
    console.log('🔄 CalendarComponent: Cargando tutorías y disponibilidades...');
    
    // Cargar ambas peticiones en paralelo con manejo individual de errores
    forkJoin({
      tutorias: this.tutoriaService.getAllTutorias().pipe(
        catchError(error => {
          console.error('❌ CalendarComponent: Error al cargar tutorías:', error);
          return of([] as Tutoria[]);
        })
      ),
      disponibilidades: this.disponibilidadService.getDisponibilidadesActivas().pipe(
        catchError(error => {
          console.error('❌ CalendarComponent: Error al cargar disponibilidades:', error);
          return of([] as Disponibilidad[]);
        })
      )
    }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({ tutorias, disponibilidades }) => {
        console.log('✅ CalendarComponent: Datos recibidos del servidor');
        console.log('✅ CalendarComponent: Tutorías:', tutorias.length);
        console.log('✅ CalendarComponent: Disponibilidades:', disponibilidades.length);
        console.log('✅ CalendarComponent: Datos de tutorías:', tutorias);
        console.log('✅ CalendarComponent: Datos de disponibilidades:', disponibilidades);
        
        this.tutorias = tutorias;
        this.disponibilidades = disponibilidades;
        
        console.log('✅ CalendarComponent: Datos asignados a las propiedades');
        
        // Verificar si hay datos
        if (tutorias.length === 0 && disponibilidades.length === 0) {
          this.error = 'No hay tutorías disponibles en este momento.';
          console.warn('⚠️ CalendarComponent: No hay datos disponibles');
        } else if (disponibilidades.length === 0) {
          this.error = 'No hay horarios disponibles en este momento.';
          console.warn('⚠️ CalendarComponent: No hay disponibilidades');
        }
        
        // Construir el horario a partir de las disponibilidades
        this.construirHorario();
        
        console.log('✅ CalendarComponent: Horario construido, procediendo a emitir estadísticas');
        
        // Emitir estadísticas
        this.emitirEstadisticas();
      },
      error: (error) => {
        console.error('❌ CalendarComponent: Error inesperado:', error);
        this.error = 'Error al cargar los datos. Por favor, intenta recargar la página.';
        
        // Emitir estadísticas vacías en caso de error
        this.statsLoaded.emit({ disponibles: 0, tutores: 0 });
      }
    });
  }

  /**
   * Emite las estadísticas calculadas a partir de los datos cargados
   */
  private emitirEstadisticas(): void {
    console.log('📊 CalendarComponent: Preparando estadísticas...');
    console.log('📊 CalendarComponent: Total tutorías:', this.tutorias.length);
    console.log('📊 CalendarComponent: Total disponibilidades:', this.disponibilidades.length);
    
    // Contar tutores únicos
    const tutoresUnicos = new Set(this.tutorias.map(t => t.idTutor));
    console.log('📊 CalendarComponent: Tutores únicos:', Array.from(tutoresUnicos));
    
    const stats: CalendarStats = {
      disponibles: this.disponibilidades.length,
      tutores: tutoresUnicos.size
    };
    
    console.log('📊 CalendarComponent: Estadísticas calculadas:', stats);
    console.log('📊 CalendarComponent: ¿Tiene suscriptores statsLoaded?', this.statsLoaded.observed);
    console.log('📊 CalendarComponent: Emitiendo evento statsLoaded con:', stats);
    
    this.statsLoaded.emit(stats);
    
    console.log('📊 CalendarComponent: Evento emitido exitosamente');
  }

  /**
   * Construye el horario a partir de las disponibilidades cargadas
   */
  private construirHorario(): void {
    console.log('🔨 CalendarComponent: Construyendo horario...');
    console.log('🔨 CalendarComponent: Total disponibilidades:', this.disponibilidades.length);
    console.log('🔨 CalendarComponent: Total tutorías:', this.tutorias.length);
    console.log('🔨 CalendarComponent: tutorId para filtrar:', this.tutorId);
    this.schedule.clear();

    // Filtrar disponibilidades por tutorId si está presente
    let disponibilidadesFiltradas = this.disponibilidades;
    if (this.tutorId) {
      console.log('🔍 CalendarComponent: Filtrando disponibilidades por tutorId:', this.tutorId);
      console.log('🔍 CalendarComponent: Listado completo de tutorías:');
      this.tutorias.forEach(t => {
        console.log(`  - Tutoría ID: ${t.idTutoria}, Nombre: ${t.nombre || t.nombreAsignatura}, Tutor: ${t.nombreTutor}, idTutor: ${t.idTutor}`);
      });
      
      // Primero, filtrar las tutorías del tutor
      const tutoriasDelTutor = this.tutorias.filter(t => {
        const idTutorNum = Number(t.idTutor);
        const tutorIdNum = Number(this.tutorId);
        const coincide = idTutorNum === tutorIdNum;
        console.log(`  🔍 Comparando Tutoría ${t.idTutoria} "${t.nombre || t.nombreAsignatura}" del tutor "${t.nombreTutor}"`);
        console.log(`     idTutor: ${t.idTutor} (${idTutorNum}) === tutorId: ${this.tutorId} (${tutorIdNum}) ? ${coincide}`);
        return coincide;
      });
      
      console.log('✅ CalendarComponent: Tutorías del tutor logueado:', tutoriasDelTutor.length);
      if (tutoriasDelTutor.length === 0) {
        console.warn('⚠️ CalendarComponent: NO SE ENCONTRARON TUTORÍAS para el tutor con ID:', this.tutorId);
        console.warn('⚠️ Verifica que el id_usuario del tutor logueado coincida con el id_tutor en la tabla Tutoria');
      } else {
        tutoriasDelTutor.forEach(t => {
          console.log(`  ✓ Tutoría: ${t.nombre || t.nombreAsignatura} (ID: ${t.idTutoria})`);
        });
      }
      
      const idsTutoriasDelTutor = new Set(tutoriasDelTutor.map(t => t.idTutoria));
      
      // Filtrar disponibilidades que corresponden a esas tutorías
      disponibilidadesFiltradas = this.disponibilidades.filter(disp => {
        const perteneceAlTutor = idsTutoriasDelTutor.has(disp.idTutoria);
        if (perteneceAlTutor) {
          const tutoria = this.tutorias.find(t => t.idTutoria === disp.idTutoria);
          console.log(`  ✓ Disponibilidad ${disp.idDisponibilidad} - ${disp.diaSemana} ${disp.horaInicio}-${disp.horaFin} para "${tutoria?.nombre || tutoria?.nombreAsignatura}"`);
        }
        return perteneceAlTutor;
      });
      
      console.log('🔨 CalendarComponent: Disponibilidades filtradas:', disponibilidadesFiltradas.length);
      
      // Si no hay disponibilidades para este tutor, mostrar mensaje y salir
      if (disponibilidadesFiltradas.length === 0) {
        console.warn('⚠️ CalendarComponent: No hay disponibilidades para este tutor. No se construirá el horario.');
        return;
      }
    }

    disponibilidadesFiltradas.forEach(disp => {
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
    const key = `${hora}__${dia}`;
    const materia = this.schedule.get(key);
    
    if (!materia || !materia.idDisponibilidad) {
      console.warn('⚠️ No hay disponibilidad para esta celda');
      return;
    }

    // Buscar la disponibilidad completa
    const disponibilidad = this.disponibilidades.find(d => d.idDisponibilidad === materia.idDisponibilidad);
    if (!disponibilidad) {
      console.error('❌ No se encontró la disponibilidad');
      return;
    }

    // Buscar la tutoría asociada
    const tutoria = this.tutorias.find(t => t.idTutoria === disponibilidad.idTutoria);
    if (!tutoria) {
      console.error('❌ No se encontró la tutoría');
      return;
    }

    this.selected = { hora, dia };
    this.selectedDisponibilidad = disponibilidad;
    this.selectedTutoria = tutoria;

    // Si estamos en modo tutor (tutorId definido y buscador oculto), mostrar lista de reservas
    if (this.tutorId && !this.showSearch) {
      this.loadReservationsForDisponibilidad(disponibilidad.idDisponibilidad);
      return;
    }

    // Modo estudiante: creación de reserva
    this.generateTimeSlots(disponibilidad);
    this.showSlotModal = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  private loadReservationsForDisponibilidad(idDisponibilidad: number) {
    this.loadingReservations = true;
    this.reservationsError = '';
    this.reservationsForSlot = [];

    this.reservationService.getReservationsByDisponibilidad(idDisponibilidad).subscribe({
      next: (list) => {
        this.reservationsForSlot = list || [];
        this.loadingReservations = false;
        this.showReservationsModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error cargando reservas de la disponibilidad:', err);
        this.reservationsError = err?.error?.message || 'No se pudieron cargar las reservas de esta franja.';
        this.loadingReservations = false;
        this.showReservationsModal = true;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Genera slots de 15 minutos dentro del rango de la disponibilidad
   */
  private generateTimeSlots(disponibilidad: Disponibilidad): void {
    this.availableSlots = [];
    
    // Convertir hora_inicio y hora_fin a minutos
    const [startHour, startMin] = disponibilidad.horaInicio.split(':').map(Number);
    const [endHour, endMin] = disponibilidad.horaFin.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Generar slots de 15 minutos
    for (let current = startMinutes; current + 15 <= endMinutes; current += 15) {
      const slotStartHour = Math.floor(current / 60);
      const slotStartMin = current % 60;
      const slotEndHour = Math.floor((current + 15) / 60);
      const slotEndMin = (current + 15) % 60;
      
      const inicio = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}:00`;
      const fin = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}:00`;
      const display = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')} - ${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}`;
      
      this.availableSlots.push({ inicio, fin, display });
    }
    
    console.log('🕐 Slots generados:', this.availableSlots.length, 'slots de 15 minutos');
  }

  selectSlot(slot: { inicio: string; fin: string }): void {
    this.selectedSlot = slot;
    this.cdr.detectChanges();
  }

  closeSlotModal(): void {
    this.showSlotModal = false;
    this.selectedDisponibilidad = null;
    this.selectedTutoria = null;
    this.availableSlots = [];
    this.selectedSlot = null;
    this.observaciones = '';
    this.errorMessage = '';
    this.creandoReserva = false;
    this.cdr.detectChanges();
  }

  closeReservationsModal(): void {
    this.showReservationsModal = false;
    this.reservationsForSlot = [];
    this.reservationsError = '';
    this.loadingReservations = false;
    this.cdr.detectChanges();
  }

  confirmarReserva(): void {
    if (!this.selectedDisponibilidad || !this.selectedSlot) {
      this.errorMessage = 'Por favor selecciona un horario';
      return;
    }

    const userData = this.authService.getUserData();
    console.log('📋 Datos de usuario obtenidos:', userData);
    
    if (!userData) {
      console.error('❌ getUserData() retornó null');
      this.errorMessage = 'No se encontraron datos de sesión. Por favor inicia sesión nuevamente.';
      return;
    }
    
    // Soportar ambos formatos: id_usuario (snake_case) e idUsuario (camelCase)
    const idUsuario = (userData as any).id_usuario || (userData as any).idUsuario;
    
    if (!idUsuario) {
      console.error('❌ userData no tiene id_usuario ni idUsuario:', userData);
      this.errorMessage = 'Datos de usuario incompletos. Por favor inicia sesión nuevamente.';
      return;
    }

    this.creandoReserva = true;
    this.errorMessage = '';

    const reservaData: CreateReservaDto = {
      idDisponibilidad: this.selectedDisponibilidad.idDisponibilidad,
      idEstudiante: idUsuario,
      horaInicio: this.selectedSlot.inicio,
      horaFin: this.selectedSlot.fin,
      observaciones: this.observaciones.trim() || undefined
    };

    console.log('📝 Creando reserva:', reservaData);

    this.reservationService.createReservation(reservaData).subscribe({
      next: (reserva) => {
        console.log('✅ Reserva creada exitosamente:', reserva);
        if (isPlatformBrowser(this.platformId)) {
          alert(`✅ Reserva creada exitosamente para el ${this.selectedSlot!.inicio.substring(0, 5)} - ${this.selectedSlot!.fin.substring(0, 5)}`);
        }
        this.closeSlotModal();
        this.cargarDatos(); // Recargar datos para actualizar cupos
      },
      error: (error) => {
        console.error('❌ Error al crear reserva:', error);
        this.errorMessage = error.message || 'Error al crear la reserva. Inténtalo de nuevo.';
        this.creandoReserva = false;
        this.cdr.detectChanges();
      }
    });
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


