import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reserva } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="section-content">
      <!-- Header de Bienvenida -->
      <div class="welcome-header">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">¡Bienvenido de nuevo! 👋</h1>
            <p class="welcome-subtitle">Aquí están tus reservas de tutoría</p>
          </div>
        </div>
      </div>

      <div class="main-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h2 class="section-title">
              <i class="bi bi-calendar-event"></i>
              Mis Próximas Reservas
            </h2>
            <span class="badge-count">{{ userReservations.length }}</span>
          </div>
        </div>

        @if (loading) {
          <div class="empty-state-modern">
            <div class="empty-illustration">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <h3 class="empty-title">Cargando reservas...</h3>
          </div>
        } @else if (userReservations.length === 0) {
          <div class="empty-state-modern">
            <div class="empty-illustration">
              <i class="bi bi-calendar-x"></i>
            </div>
            <h3 class="empty-title">No tienes reservas</h3>
            <p class="empty-description">Aún no has realizado ninguna reserva</p>
          </div>
        } @else {
          <div class="reservations-list">
            @for (reserva of userReservations; track reserva.idReserva) {
              <div class="reserva-card">
                <div class="reserva-header-row">
                  <div class="estudiante-info">
                    <i class="bi bi-book"></i>
                    <div>
                      <h4>{{ reserva.nombreAsignatura || 'Tutoría' }}</h4>
                      <span class="tutor-name">{{ reserva.nombreTutor || 'Tutor' }}</span>
                    </div>
                  </div>
                  <span class="badge-estado" [ngClass]="getEstadoBadgeClass(reserva.nombreEstado || '')">
                    {{ reserva.nombreEstado || 'Pendiente' }}
                  </span>
                </div>

                <div class="reserva-details">
                  @if (reserva.diaSemana || reserva.fechaDisponibilidad) {
                    <div class="detail-item">
                      <i class="bi bi-calendar3"></i>
                      <span>{{ reserva.diaSemana }} {{ formatDateShort(reserva.fechaDisponibilidad) }}</span>
                    </div>
                  }
                  
                  <div class="detail-item">
                    <i class="bi bi-clock"></i>
                    <span>{{ formatTime(reserva.horaInicio) }} - {{ formatTime(reserva.horaFin) }}</span>
                  </div>
                  
                  @if (reserva.modalidad) {
                    <div class="detail-item">
                      <i class="bi" [ngClass]="reserva.modalidad === 'Virtual' ? 'bi-camera-video' : 'bi-geo-alt'"></i>
                      <span>{{ reserva.modalidad }}</span>
                    </div>
                  }

                  @if (reserva.modalidad === 'Virtual' && reserva.meetLink) {
                    <div class="detail-item meet-link">
                      <i class="bi bi-link-45deg"></i>
                      <a [href]="reserva.meetLink" target="_blank" class="link-meet">
                        Enlace de Meet
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    </div>
                  }

                  @if (reserva.observaciones) {
                    <div class="detail-item observaciones">
                      <i class="bi bi-chat-left-text"></i>
                      <span>{{ reserva.observaciones }}</span>
                    </div>
                  }

                  @if (reserva.fechaCreacion) {
                    <div class="detail-item fecha-creacion">
                      <i class="bi bi-calendar-plus"></i>
                      <span class="text-muted">Creada: {{ formatDate(reserva.fechaCreacion) }}</span>
                    </div>
                  }
                </div>

                @if (canCancelReserva(reserva)) {
                  <div class="reserva-actions">
                    <button class="btn-cancel-reserva" (click)="openCancelModal(reserva)" [disabled]="cancellingReservaId === reserva.idReserva">
                      @if (cancellingReservaId === reserva.idReserva) {
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Cancelando...</span>
                      } @else {
                        <i class="bi bi-x-circle"></i>
                        <span>Cancelar Reserva</span>
                      }
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Modal de cancelación -->
    @if (showCancelModal && reservaToCancel) {
      <div class="modal-overlay" (click)="closeCancelModal()">
        <div class="modal-cancel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>
              <i class="bi bi-exclamation-triangle"></i>
              Cancelar Reserva
            </h3>
            <button class="btn-close-modal" (click)="closeCancelModal()">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="reserva-info-cancel">
              <p><strong>{{ reservaToCancel.nombreAsignatura }}</strong></p>
              <p>{{ reservaToCancel.nombreTutor }}</p>
              <p>{{ formatTime(reservaToCancel.horaInicio) }} - {{ formatTime(reservaToCancel.horaFin) }}</p>
            </div>

            <div class="form-group">
              <label for="cancelReason">Razón de cancelación *</label>
              <textarea 
                id="cancelReason"
                [(ngModel)]="cancelReason"
                placeholder="Por favor indica el motivo de la cancelación..."
                rows="4"
                class="form-control"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeCancelModal()" [disabled]="isCancelling">
              <i class="bi bi-x-circle"></i>
              Cerrar
            </button>
            <button class="btn-danger" (click)="confirmCancel()" [disabled]="!cancelReason.trim() || isCancelling">
              @if (isCancelling) {
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Cancelando...</span>
              } @else {
                <i class="bi bi-check-circle"></i>
                <span>Confirmar Cancelación</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
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
