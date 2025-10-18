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

interface FavoriteRoom {
  id: number;
  name: string;
  building: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="section-content">
      <!-- Alert de notificaciones -->
      @if (todayReservations > 0) {
        <div class="alert alert-info mb-4">
          <i class="bi bi-info-circle me-2"></i>
          Tienes <strong>{{ todayReservations }}</strong> reserva(s) para hoy
        </div>
      }

      <!-- Quick Stats -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-sm-6">
          <div class="stat-card">
            <div class="stat-icon bg-success">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-info">
              <h4>{{ activeReservationsCount }}</h4>
              <p>Reservas Activas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card">
            <div class="stat-icon bg-primary">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-info">
              <h4>{{ upcomingReservationsCount }}</h4>
              <p>Próximas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card">
            <div class="stat-icon bg-warning">
              <i class="bi bi-bookmark-check"></i>
            </div>
            <div class="stat-info">
              <h4>{{ completedReservationsCount }}</h4>
              <p>Completadas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card">
            <div class="stat-icon bg-danger">
              <i class="bi bi-star"></i>
            </div>
            <div class="stat-info">
              <h4>{{ favoriteRoomsCount }}</h4>
              <p>Favoritos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximas Reservas -->
      <div class="row g-4">
        <div class="col-lg-8">
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

        <div class="col-lg-4">
          <!-- Acciones Rápidas -->
          <div class="card mb-3">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-lightning me-2"></i>Acciones Rápidas
              </h5>
            </div>
            <div class="card-body d-grid gap-2">
              <a class="btn btn-success" routerLink="/dashboard/reservation">
                <i class="bi bi-plus-circle me-2"></i>Nueva Reserva
              </a>
              <a class="btn btn-outline-primary" routerLink="/calendar">
                <i class="bi bi-calendar me-2"></i>Ver Calendario
              </a>
              <a class="btn btn-outline-secondary" routerLink="/dashboard/history">
                <i class="bi bi-clock-history me-2"></i>Ver Historial
              </a>
            </div>
          </div>

          <!-- Espacios Favoritos -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-star me-2"></i>Espacios Favoritos
              </h5>
            </div>
            <div class="card-body">
              @for (favorite of favoriteRoomsList; track favorite.id) {
                <div class="favorite-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-0">{{ favorite.name }}</h6>
                      <small class="text-muted">{{ favorite.building }}</small>
                    </div>
                    <a class="btn btn-sm btn-outline-success" title="Reservar" routerLink="/dashboard/reservation">
                      <i class="bi bi-calendar-plus"></i>
                    </a>
                  </div>
                </div>
              }
              @if (favoriteRoomsList.length === 0) {
                <div class="text-center text-muted py-3">
                  <i class="bi bi-star" style="font-size: 2rem;"></i>
                  <p class="small mt-2">No tienes favoritos aún</p>
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
  // Estadísticas
  activeReservationsCount: number = 3;
  upcomingReservationsCount: number = 5;
  completedReservationsCount: number = 12;
  favoriteRoomsCount: number = 4;
  todayReservations: number = 2;

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

  favoriteRoomsList: FavoriteRoom[] = [
    { id: 1, name: 'Sala B-302', building: 'Edificio B' },
    { id: 2, name: 'Cubículo 15', building: 'Biblioteca' },
    { id: 3, name: 'Sala A-105', building: 'Edificio A' },
    { id: 4, name: 'Sala C-201', building: 'Edificio C' }
  ];
}
