import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, Reserva } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { CalendarComponent } from '../../calendar/calendar';
import { Disponibilidad } from '../../../services/disponibilidad.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class Agenda implements OnInit {
  reservations: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  pageSize: number = 6;
  currentPage: number = 0;
  pagedReservations: any[] = [];
  Math = Math;
  tutorId: number = 0;

  // Modal para mostrar reservas de un slot
  showReservasModal: boolean = false;
  reservasDelSlot: Reserva[] = [];
  slotSeleccionado: Disponibilidad | null = null;
  loadingReservas: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Obtener el ID del tutor desde los datos de usuario
    const userData = this.authService.getUserData();
    const profile = this.authService.getCachedProfile();
    console.log('📋 Agenda: userData obtenido:', userData);
    console.log('📋 Agenda: profile obtenido:', profile);
    if (userData) {
      // El userData puede tener id_usuario o idUsuario dependiendo del formato
      this.tutorId = (userData as any).idUsuario || (userData as any).id_usuario;
      console.log('✅ Agenda: tutorId establecido a:', this.tutorId);
    } else {
      console.error('❌ Agenda: No se pudo obtener userData');
    }
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = null;
    
    this.reservationService.getPendingReservations().subscribe({
      next: (res: any[]) => {
        setTimeout(() => {
          console.log('Reservas recibidas:', res);
          this.reservations = res || [];
          this.loading = false;
          this.applyPaging();
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err: any) => {
        setTimeout(() => {
          console.error('Error cargando reservas:', err);
          this.error = 'No se pudieron cargar las reservas.';
          this.loading = false;
          this.cdr.markForCheck();
        }, 0);
      }
    });
  }

  applyPaging(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedReservations = this.reservations.slice(start, start + this.pageSize);
    console.log('Paginación aplicada:', this.pagedReservations);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.reservations.length) {
      this.currentPage++;
      this.applyPaging();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyPaging();
    }
  }

  // Template helpers
  trackReservation = (_: number, r: any) => r?.id || `${r?.fecha}-${r?.hora}`;

  formatDate(d: string) {
    if (!d) return '';
    try { const dt = new Date(d); return dt.toLocaleDateString(); } catch { return d; }
  }

  /**
   * Manejador de evento cuando se selecciona un slot del calendario
   * @param disponibilidad Disponibilidad seleccionada del calendario
   */
  onSlotSelected(disponibilidad: Disponibilidad): void {
    console.log('📅 Agenda: Slot seleccionado:', disponibilidad);
    this.slotSeleccionado = disponibilidad;
    this.loadingReservas = true;
    this.showReservasModal = true;
    
    // Cargar las reservas de esta disponibilidad
    this.reservationService.getReservationsByDisponibilidad(disponibilidad.idDisponibilidad)
      .subscribe({
        next: (reservas) => {
          console.log('✅ Agenda: Reservas cargadas:', reservas.length);
          this.reservasDelSlot = reservas;
          this.loadingReservas = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Agenda: Error al cargar reservas:', err);
          this.reservasDelSlot = [];
          this.loadingReservas = false;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Cierra el modal de reservas del slot
   */
  closeReservasModal(): void {
    this.showReservasModal = false;
    this.reservasDelSlot = [];
    this.slotSeleccionado = null;
  }

  /**
   * Formatea la hora para mostrar (HH:mm)
   */
  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // HH:mm:ss -> HH:mm
  }

  /**
   * Obtiene la clase CSS para el estado de la reserva
   */
  getEstadoClass(estado: string): string {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('reservada') || estadoLower.includes('confirmada')) return 'estado-confirmada';
    if (estadoLower.includes('cancelada')) return 'estado-cancelada';
    if (estadoLower.includes('realizada')) return 'estado-realizada';
    if (estadoLower.includes('no asistida')) return 'estado-no-asistida';
    return 'estado-default';
  }

}

