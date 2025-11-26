import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reserva } from '../../../services/reservation.service';
import { ReservaDetailModalComponent } from '../../../components/reserva-detail-modal/reserva-detail-modal';
import { ReporteService } from '../../../services/reporte.service';

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
   * Cancelar una reserva directamente
   */
  cancelarReserva(reserva: Reserva) {
    if (reserva.nombreEstado === 'Cancelada') {
      alert('❌ Esta reserva ya está cancelada');
      return;
    }

    const razon = prompt(`⚠️ Cancelar reserva #${reserva.idReserva} de ${reserva.nombreEstudiante}\n\nIngresa la razón de la cancelación:`);
    
    if (!razon) {
      alert('❌ Debes proporcionar una razón para la cancelación');
      return;
    }

    this.loading = true;
    this.reservationService.cancelReservation(reserva.idReserva, razon).subscribe({
      next: () => {
        alert('✅ Reserva cancelada exitosamente');
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error al cancelar reserva:', error);
        alert('❌ Error al cancelar la reserva: ' + (error.error?.mensaje || error.message || 'Error desconocido'));
        this.loading = false;
      }
    });
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

  constructor(private reporteService: ReporteService) {}
  
  get filteredMaterias() {
    if (!this.searchMateria) {
      return this.materiasDetalle;
    }
    const search = this.searchMateria.toLowerCase();
    return this.materiasDetalle.filter(m => 
      m.nombre.toLowerCase().includes(search) || 
      m.codigo.toLowerCase().includes(search)
    );
  }

  // Estadísticas principales
  stats: any = {
    totalReservas: 0,
    reservasTrend: 0,
    reservasCompletadas: 0,
    tasaCompletadas: 0,
    reservasPendientes: 0,
    tasaPendientes: 0,
    reservasActivas: 0,
    reservasCanceladas: 0,
    estudiantesActivos: 0,
    estudiantesTrend: 0
  };

  // Métricas adicionales
  metrics: any = {
    tiempoPromedio: 0,
    asistencia: 0,
    reincidencia: 0,
    satisfaccion: 0,
    cancelaciones: 0,
    crecimiento: 0
  };

  // Reservas por día (últimos 7 días)
  reservasPorDia: any[] = [];

  maxReservasDay = 52;

  // Top materias
  topMaterias: any[] = [];

  // Top tutores
  topTutores: any[] = [];

  // Horarios pico
  horariosPico: any[] = [];

  // Análisis detallado por materia
  materiasDetalle: any[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.reporteService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = {
            ...data.stats,
            reservasTrend: 12.5, // Mocked
            tasaCompletadas: data.stats.totalReservas > 0 ? Math.round((data.stats.reservasCompletadas / data.stats.totalReservas) * 100) : 0,
            tasaPendientes: data.stats.totalReservas > 0 ? Math.round((data.stats.reservasPendientes / data.stats.totalReservas) * 100) : 0,
            reservasActivas: data.stats.reservasPendientes,
            estudiantesTrend: 8.3 // Mocked
        };
        this.metrics = {
            ...data.metrics,
            reincidencia: 68, // Mocked
            satisfaccion: 4.7, // Mocked
            cancelaciones: data.stats.totalReservas > 0 ? Math.round((data.stats.reservasCanceladas / data.stats.totalReservas) * 100) : 0
        };
        this.reservasPorDia = data.reservasPorDia || [];
        this.materiasDetalle = data.materiasDetalle || [];
        this.horariosPico = data.horariosPico || [];
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    // Aquí se podría recargar la data filtrada por periodo
    console.log('Periodo seleccionado:', period);
  }

  getStrokeDasharray(percentage: number): string {
    const circumference = 2 * Math.PI * 15.9155; // r=15.9155
    const dash = (percentage / 100) * circumference;
    return `${dash} ${circumference}`;
  }

  exportarExcel() {
    console.log('Exportando a Excel...');
    // Implementación futura
    alert('Funcionalidad de exportación a Excel en desarrollo');
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
