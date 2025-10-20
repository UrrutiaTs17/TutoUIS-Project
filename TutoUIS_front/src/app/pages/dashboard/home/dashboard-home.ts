import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Reservation {
  id: number;
  roomName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="section-content">

      <!-- Próximas Reservas -->
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-calendar-event me-2"></i>Mis Próximas Reservas
              </h5>
              <a class="btn btn-sm btn-success" routerLink="/dashboard/reservation">
                <i class="bi bi-plus-circle me-1"></i>Nueva
              </a>
            </div>
            <div class="card-body">
              @if (upcomingReservationsList.length === 0) {
                <div class="text-center py-5 text-muted">
                  <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                  <p class="mt-3">No tienes reservas próximas</p>
                  <a class="btn btn-success" routerLink="/dashboard/reservation">
                    Crear una reserva
                  </a>
                </div>
              }

              @for (reservation of upcomingReservationsList; track reservation.id) {
                <div class="reservation-item">
                  <div class="reservation-info">
                    <div class="reservation-icon">
                      <i class="bi bi-door-open"></i>
                    </div>
                    <div class="reservation-details">
                      <h6 class="mb-1">{{ reservation.roomName }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-calendar3 me-1"></i>{{ reservation.date }}
                        <span class="mx-2">|</span>
                        <i class="bi bi-clock me-1"></i>{{ reservation.time }}
                      </small>
                    </div>
                  </div>
                  <div class="reservation-actions">
                    <button class="btn btn-sm btn-outline-primary" title="Ver detalles">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Cancelar">
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styleUrl: './dashboard-home.css'
})
export class DashboardHome {
  // Listas de datos
  upcomingReservationsList: Reservation[] = [
    {
      id: 1,
      roomName: 'Sala de Estudio B-302',
      date: '15 de Oct, 2025',
      time: '14:00 - 16:00',
      status: 'confirmed'
    },
    {
      id: 2,
      roomName: 'Cubículo Individual 15',
      date: '16 de Oct, 2025',
      time: '10:00 - 12:00',
      status: 'confirmed'
    },
    {
      id: 3,
      roomName: 'Sala Grupal A-105',
      date: '18 de Oct, 2025',
      time: '15:00 - 17:00',
      status: 'pending'
    }
  ];
}
