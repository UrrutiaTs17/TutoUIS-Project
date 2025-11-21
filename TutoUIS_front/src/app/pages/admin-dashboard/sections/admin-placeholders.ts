import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reserva } from '../../../services/reservation.service';
import { ReservaDetailModalComponent } from '../../../components/reserva-detail-modal/reserva-detail-modal';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReservaDetailModalComponent],
  templateUrl: './admin-reservations.html',
  styleUrl: './admin-reservations.css'
})
export class AdminReservations implements OnInit {
  @ViewChild(ReservaDetailModalComponent) modalComponent!: ReservaDetailModalComponent;
  
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal data
  selectedReserva: Reserva | null = null;
  isEditMode = false;
  
  // Filtros
  searchTerm = '';
  filterEstado = '';
  filterFecha = '';

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('AdminReservations - ngOnInit');
    this.loadReservations();
    
    // Timeout de seguridad: si después de 15 segundos sigue cargando, forzar detención
    setTimeout(() => {
      if (this.loading) {
        console.error('AdminReservations - TIMEOUT: Carga tomó más de 15 segundos');
        this.loading = false;
        this.error = 'La carga está tardando demasiado. Por favor, verifica que el backend esté corriendo.';
        this.cdr.detectChanges();
      }
    }, 15000);
  }

  loadReservations() {
    console.log('AdminReservations - Iniciando carga de reservas...');
    this.loading = true;
    this.error = null;
    
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        console.log('AdminReservations - Reservas recibidas:', data.length, data);
        this.reservas = data;
        this.reservasFiltradas = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('AdminReservations - Estado después de cargar:', {
          reservas: this.reservas.length,
          filtradas: this.reservasFiltradas.length,
          loading: this.loading
        });
      },
      error: (error) => {
        console.error('AdminReservations - Error al cargar reservas:', error);
        this.error = 'No se pudieron cargar las reservas. Verifica tu conexión y que el backend esté activo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      // Filtro por búsqueda (ID estudiante o disponibilidad)
      const matchSearch = this.searchTerm === '' || 
        reserva.idEstudiante.toString().includes(this.searchTerm) ||
        reserva.idDisponibilidad.toString().includes(this.searchTerm) ||
        reserva.idReserva.toString().includes(this.searchTerm) ||
        (reserva.nombreEstudiante || '').toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por estado
      const matchEstado = this.filterEstado === '' || 
        reserva.nombreEstado === this.filterEstado;

      // Filtro por fecha
      let matchFecha = true;
      if (this.filterFecha && reserva.fechaCreacion) {
        const fechaReserva = new Date(reserva.fechaCreacion);
        const hoy = new Date();
        
        if (this.filterFecha === 'hoy') {
          matchFecha = fechaReserva.toDateString() === hoy.toDateString();
        } else if (this.filterFecha === 'semana') {
          const semanaAtras = new Date();
          semanaAtras.setDate(hoy.getDate() - 7);
          matchFecha = fechaReserva >= semanaAtras;
        } else if (this.filterFecha === 'mes') {
          const mesAtras = new Date();
          mesAtras.setMonth(hoy.getMonth() - 1);
          matchFecha = fechaReserva >= mesAtras;
        }
      }

      return matchSearch && matchEstado && matchFecha;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterEstado = '';
    this.filterFecha = '';
    this.reservasFiltradas = this.reservas;
  }

  getReservasPorEstado(estado: string): number {
    return this.reservas.filter(r => r.nombreEstado === estado).length;
  }

  /**
   * Ver detalles de una reserva en modal
   */
  verDetalles(reserva: Reserva) {
    this.selectedReserva = reserva;
    this.isEditMode = false;
    setTimeout(() => {
      this.modalComponent.showModal();
    }, 100);
  }

  /**
   * Editar una reserva en modal
   */
  editarReserva(reserva: Reserva) {
    if (reserva.nombreEstado === 'Cancelada') {
      alert('❌ No se puede editar una reserva cancelada');
      return;
    }

    this.selectedReserva = reserva;
    this.isEditMode = true;
    setTimeout(() => {
      this.modalComponent.showModal();
    }, 100);
  }

  /**
   * Handler cuando se guarda una reserva editada
   */
  onReservaSaved() {
    this.loadReservations();
  }

  /**
   * Handler cuando se cancela una reserva desde el modal
   */
  onReservaCancelled() {
    this.loadReservations();
  }

  /**
   * Eliminar una reserva permanentemente
   */
  eliminarReserva(reserva: Reserva) {
    const confirmar = confirm(
      `⚠️ ¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE la reserva #${reserva.idReserva} de ${reserva.nombreEstudiante}?\n\n` +
      `Esta acción NO se puede deshacer.\n\n` +
      `Si solo deseas cancelarla, usa el botón de editar.`
    );
    
    if (!confirmar) return;

    // Doble confirmación para operaciones destructivas
    const confirmar2 = confirm('⚠️ Confirma nuevamente que deseas ELIMINAR esta reserva permanentemente.');
    if (!confirmar2) return;

    this.loading = true;
    this.reservationService.deleteReservation(reserva.idReserva).subscribe({
      next: () => {
        alert('✅ Reserva eliminada exitosamente');
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error al eliminar reserva:', error);
        alert('❌ Error al eliminar la reserva: ' + (error.error?.mensaje || error.message || 'Error desconocido'));
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'app-admin-spaces',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-door-open me-2"></i>Gestión de Espacios
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-building"></i>
          <h5>Gestión de Espacios</h5>
          <p class="text-muted">Aquí se mostrará la lista completa de espacios disponibles</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `]
})
export class AdminSpaces {}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit {
  selectedPeriod: string = 'mes';
  lastUpdate: Date = new Date();
  searchMateria: string = '';
  
  // Estadísticas principales
  stats = {
    totalReservas: 248,
    reservasTrend: 12.5,
    reservasCompletadas: 186,
    tasaCompletadas: 75,
    reservasPendientes: 35,
    tasaPendientes: 14,
    reservasActivas: 27,
    reservasCanceladas: 0,
    estudiantesActivos: 142,
    estudiantesTrend: 8.3
  };

  // Métricas adicionales
  metrics = {
    tiempoPromedio: 45,
    asistencia: 92,
    reincidencia: 68,
    satisfaccion: 4.7,
    cancelaciones: 8,
    crecimiento: 15.3
  };

  // Reservas por día (últimos 7 días)
  reservasPorDia = [
    { label: 'Lun', count: 32, index: 0 },
    { label: 'Mar', count: 45, index: 1 },
    { label: 'Mié', count: 38, index: 2 },
    { label: 'Jue', count: 52, index: 3 },
    { label: 'Vie', count: 41, index: 4 },
    { label: 'Sáb', count: 28, index: 5 },
    { label: 'Dom', count: 12, index: 6 }
  ];

  maxReservasDay = 52;

  // Top materias
  topMaterias = [
    { nombre: 'Cálculo Diferencial', codigo: 'MAT-101', carrera: 'Ingeniería', reservas: 45 },
    { nombre: 'Programación I', codigo: 'SIS-201', carrera: 'Sistemas', reservas: 38 },
    { nombre: 'Física Mecánica', codigo: 'FIS-301', carrera: 'Ingeniería', reservas: 32 },
    { nombre: 'Química General', codigo: 'QUI-101', carrera: 'Química', reservas: 28 },
    { nombre: 'Álgebra Lineal', codigo: 'MAT-102', carrera: 'Matemáticas', reservas: 25 }
  ];

  // Top tutores
  topTutores = [
    { nombre: 'Carlos Rodríguez', rating: 5, tutorias: 42 },
    { nombre: 'Ana María López', rating: 5, tutorias: 38 },
    { nombre: 'Juan Pérez Silva', rating: 4, tutorias: 35 },
    { nombre: 'Laura Martínez', rating: 5, tutorias: 31 },
    { nombre: 'Diego Gómez', rating: 4, tutorias: 28 }
  ];

  // Horarios pico
  horariosPico = [
    { periodo: '10:00 - 12:00', descripcion: 'Mañana', reservas: 68 },
    { periodo: '14:00 - 16:00', descripcion: 'Tarde', reservas: 52 },
    { periodo: '16:00 - 18:00', descripcion: 'Tarde', reservas: 45 },
    { periodo: '08:00 - 10:00', descripcion: 'Mañana', reservas: 38 },
    { periodo: '18:00 - 20:00', descripcion: 'Noche', reservas: 25 }
  ];

  // Análisis detallado por materia
  materiasDetalle = [
    {
      inicial: 'C',
      nombre: 'Cálculo Diferencial',
      codigo: 'MAT-101',
      total: 45,
      completadas: 35,
      pendientes: 8,
      canceladas: 2,
      tasaExito: 78,
      rating: 5
    },
    {
      inicial: 'P',
      nombre: 'Programación I',
      codigo: 'SIS-201',
      total: 38,
      completadas: 30,
      pendientes: 6,
      canceladas: 2,
      tasaExito: 79,
      rating: 5
    },
    {
      inicial: 'F',
      nombre: 'Física Mecánica',
      codigo: 'FIS-301',
      total: 32,
      completadas: 24,
      pendientes: 5,
      canceladas: 3,
      tasaExito: 75,
      rating: 4
    },
    {
      inicial: 'Q',
      nombre: 'Química General',
      codigo: 'QUI-101',
      total: 28,
      completadas: 22,
      pendientes: 4,
      canceladas: 2,
      tasaExito: 79,
      rating: 4
    },
    {
      inicial: 'A',
      nombre: 'Álgebra Lineal',
      codigo: 'MAT-102',
      total: 25,
      completadas: 19,
      pendientes: 4,
      canceladas: 2,
      tasaExito: 76,
      rating: 5
    },
    {
      inicial: 'B',
      nombre: 'Base de Datos',
      codigo: 'SIS-301',
      total: 22,
      completadas: 17,
      pendientes: 3,
      canceladas: 2,
      tasaExito: 77,
      rating: 4
    },
    {
      inicial: 'E',
      nombre: 'Estructuras de Datos',
      codigo: 'SIS-202',
      total: 20,
      completadas: 15,
      pendientes: 3,
      canceladas: 2,
      tasaExito: 75,
      rating: 5
    },
    {
      inicial: 'I',
      nombre: 'Ingeniería de Software',
      codigo: 'SIS-401',
      total: 18,
      completadas: 14,
      pendientes: 3,
      canceladas: 1,
      tasaExito: 78,
      rating: 4
    }
  ];

  ngOnInit(): void {
    this.calculateStats();
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.calculateStats();
  }

  calculateStats(): void {
    // Aquí se calcularían las estadísticas según el período seleccionado
    this.lastUpdate = new Date();
  }

  getStrokeDasharray(percentage: number): string {
    const circumference = 2 * Math.PI * 80; // radio = 80
    const dash = (percentage / 100) * circumference;
    return `${dash} ${circumference}`;
  }
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-gear me-2"></i>Configuración del Sistema
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-sliders"></i>
          <h5>Configuración del Sistema</h5>
          <p class="text-muted">Aquí podrás configurar parámetros globales del sistema</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `]
})
export class AdminSettings {}
