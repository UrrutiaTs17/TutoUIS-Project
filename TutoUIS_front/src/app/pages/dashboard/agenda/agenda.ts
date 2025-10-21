import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { CalendarComponent } from '../../calendar/calendar';

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
  tutorId: number = 0; // Debe obtenerse del perfil del usuario actual

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    // Aquí deberías obtener el id del tutor desde el servicio de autenticación
    // this.tutorId = this.authService.getUserProfile().id_usuario;
    this.tutorId = 2; // Demo: id fijo
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = null;
    this.reservationService.getPendingReservations().subscribe(
      (res: any[]) => {
        this.reservations = res || [];
        this.loading = false;
        this.applyPaging();
      },
      (err: any) => {
        console.error('Error cargando reservas:', err);
        this.error = 'No se pudieron cargar las reservas.';
        this.loading = false;
      }
    );
  }

  applyPaging(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedReservations = this.reservations.slice(start, start + this.pageSize);
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

}

