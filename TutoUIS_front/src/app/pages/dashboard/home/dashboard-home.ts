import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reserva } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  userReservations: Reserva[] = [];
  loading: boolean = false;
  idEstudiante: number = 0;
  
  // Cancel modal
  showCancelModal: boolean = false;
  reservaToCancel: Reserva | null = null;
  cancelReason: string = '';
  isCancelling: boolean = false;
  cancellingReservaId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.idEstudiante = (userData as any).idUsuario || (userData as any).id_usuario;
      console.log('📋 DashboardHome: idEstudiante:', this.idEstudiante);
      this.loadUserReservations();
    }
  }

  loadUserReservations(): void {
    if (!this.idEstudiante) {
      console.warn('DashboardHome: No hay idEstudiante');
      return;
    }

    this.loading = true;
    console.log('🔄 DashboardHome: Iniciando carga de reservas para estudiante:', this.idEstudiante);
    
    this.reservationService.getUserReservations(this.idEstudiante).subscribe({
      next: (reservas) => {
        console.log('✅ DashboardHome: Reservas cargadas:', reservas.length);
        console.log('📦 DashboardHome: Datos de reservas:', reservas);
        // Filtrar reservas canceladas
        this.userReservations = reservas.filter(r => {
          const estado = r.nombreEstado?.toLowerCase() || '';
          return !estado.includes('cancelada');
        });
        console.log('🔍 DashboardHome: Reservas activas (sin canceladas):', this.userReservations.length);
        this.loading = false;
        console.log('🔍 DashboardHome: Estado después de cargar - loading:', this.loading, 'reservas:', this.userReservations.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ DashboardHome: Error al cargar reservas:', err);
        this.userReservations = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  canCancelReserva(reserva: Reserva): boolean {
    const estado = reserva.nombreEstado?.toLowerCase() || '';
    return estado.includes('reservada') || estado.includes('confirmada') || estado.includes('pendiente');
  }

  openCancelModal(reserva: Reserva): void {
    this.reservaToCancel = reserva;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    if (!this.isCancelling) {
      this.showCancelModal = false;
      this.reservaToCancel = null;
      this.cancelReason = '';
    }
  }

  confirmCancel(): void {
    if (!this.reservaToCancel || !this.cancelReason.trim()) {
      return;
    }

    this.isCancelling = true;
    this.cancellingReservaId = this.reservaToCancel.idReserva;

    this.reservationService.cancelReservation(this.reservaToCancel.idReserva, this.cancelReason).subscribe({
      next: (result) => {
        console.log('✅ Reserva cancelada exitosamente:', result);
        // Recargar las reservas
        this.loadUserReservations();
        this.isCancelling = false;
        this.cancellingReservaId = null;
        this.closeCancelModal();
      },
      error: (err) => {
        console.error('❌ Error al cancelar reserva:', err);
        alert('Error al cancelar la reserva. Por favor intenta de nuevo.');
        this.isCancelling = false;
        this.cancellingReservaId = null;
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  formatDateShort(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  }

  getEstadoClass(estado: string | undefined): string {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('reservada') || estadoLower.includes('confirmada')) return 'confirmada';
    if (estadoLower.includes('pendiente')) return 'pendiente';
    return 'pendiente';
  }

  getEstadoBadgeClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('reservada') || estadoLower.includes('confirmada')) return 'estado-confirmada';
    if (estadoLower.includes('cancelada')) return 'estado-cancelada';
    if (estadoLower.includes('realizada')) return 'estado-realizada';
    if (estadoLower.includes('no asistida')) return 'estado-no-asistida';
    return 'estado-default';
  }
}
