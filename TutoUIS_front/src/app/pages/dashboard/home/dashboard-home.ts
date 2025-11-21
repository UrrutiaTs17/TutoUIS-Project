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
      <!-- Header de Bienvenida -->
      <div class="welcome-header">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">¡Bienvenido de nuevo! 👋</h1>
            <p class="welcome-subtitle">Aquí está un resumen de tus actividades de tutoría</p>
          </div>
          <div class="welcome-actions">
            <a class="btn-new-reservation" routerLink="/dashboard/reservation">
              <i class="bi bi-plus-circle"></i>
              <span>Nueva Reserva</span>
            </a>
            <a class="btn-view-calendar" routerLink="/dashboard/agenda">
              <i class="bi bi-calendar3"></i>
              <span>Ver Calendario</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="stats-grid">
        <div class="stat-card-modern card-purple">
          <div class="stat-icon-wrapper">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-number">{{ stats.totalReservas }}</h3>
              <p class="stat-label">Total Reservas</p>
            </div>
            <div class="stat-trend positive">
              <i class="bi bi-arrow-up"></i>
              <span>+3 este mes</span>
            </div>
          </div>
        </div>

        <div class="stat-card-modern card-green">
          <div class="stat-icon-wrapper">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-number">{{ stats.completadas }}</h3>
              <p class="stat-label">Completadas</p>
            </div>
            <div class="stat-progress">
              <div class="progress-bar-mini" [style.width.%]="stats.tasaCompletadas"></div>
            </div>
          </div>
        </div>

        <div class="stat-card-modern card-blue">
          <div class="stat-icon-wrapper">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-number">{{ stats.proximas }}</h3>
              <p class="stat-label">Próximas</p>
            </div>
            <div class="stat-info">
              <i class="bi bi-clock"></i>
              <span>Esta semana</span>
            </div>
          </div>
        </div>

        <div class="stat-card-modern card-orange">
          <div class="stat-icon-wrapper">
            <i class="bi bi-star-fill"></i>
          </div>
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-number">{{ stats.calificacion }}/5</h3>
              <p class="stat-label">Calificación</p>
            </div>
            <div class="rating-stars">
              @for (star of [1,2,3,4,5]; track star) {
                <i class="bi bi-star-fill" [class.active]="star <= stats.calificacion"></i>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Próximas Reservas -->
      <div class="main-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h2 class="section-title">
              <i class="bi bi-calendar-event"></i>
              Mis Próximas Reservas
            </h2>
            <span class="badge-count">{{ upcomingReservationsList.length }}</span>
          </div>
          <div class="section-filters">
            <button class="filter-btn active">
              <i class="bi bi-list-ul"></i>
              Todas
            </button>
            <button class="filter-btn">
              <i class="bi bi-clock"></i>
              Hoy
            </button>
            <button class="filter-btn">
              <i class="bi bi-calendar-week"></i>
              Semana
            </button>
          </div>
        </div>

        @if (upcomingReservationsList.length === 0) {
          <div class="empty-state-modern">
            <div class="empty-illustration">
              <i class="bi bi-calendar-x"></i>
            </div>
            <h3 class="empty-title">No tienes reservas próximas</h3>
            <p class="empty-description">Comienza reservando tu primera sesión de tutoría</p>
            <a class="btn-empty-action" routerLink="/dashboard/reservation">
              <i class="bi bi-plus-circle"></i>
              Crear mi primera reserva
            </a>
          </div>
        }

        <div class="reservations-grid">
          @for (reservation of upcomingReservationsList; track reservation.id) {
            <div class="reservation-card" [class.confirmed]="reservation.status === 'confirmed'" [class.pending]="reservation.status === 'pending'">
              <div class="reservation-badge" [class.badge-confirmed]="reservation.status === 'confirmed'" [class.badge-pending]="reservation.status === 'pending'">
                <i class="bi" [ngClass]="reservation.status === 'confirmed' ? 'bi-check-circle-fill' : 'bi-clock-fill'"></i>
                <span>{{ reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente' }}</span>
              </div>
              
              <div class="reservation-header">
                <div class="room-icon">
                  <i class="bi bi-door-open"></i>
                </div>
                <div class="room-info">
                  <h3 class="room-name">{{ reservation.roomName }}</h3>
                  <p class="room-type">Sala de tutoría</p>
                </div>
              </div>

              <div class="reservation-details-grid">
                <div class="detail-item">
                  <div class="detail-icon">
                    <i class="bi bi-calendar3"></i>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">{{ reservation.date }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Horario</span>
                    <span class="detail-value">{{ reservation.time }}</span>
                  </div>
                </div>
              </div>

              <div class="reservation-footer">
                <button class="btn-card-action btn-view">
                  <i class="bi bi-eye"></i>
                  <span>Ver Detalles</span>
                </button>
                <button class="btn-card-action btn-cancel">
                  <i class="bi bi-x-circle"></i>
                  <span>Cancelar</span>
                </button>
              </div>

              <div class="card-glow"></div>
            </div>
          }
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <div class="quick-actions-section">
        <h2 class="section-title">
          <i class="bi bi-lightning-charge"></i>
          Accesos Rápidos
        </h2>
        
        <div class="quick-actions-grid">
          <a class="quick-action-card" routerLink="/dashboard/reservation">
            <div class="quick-action-icon purple">
              <i class="bi bi-calendar-plus"></i>
            </div>
            <div class="quick-action-content">
              <h4>Nueva Reserva</h4>
              <p>Reserva una sesión de tutoría</p>
            </div>
            <i class="bi bi-arrow-right quick-action-arrow"></i>
          </a>

          <a class="quick-action-card" routerLink="/dashboard/agenda">
            <div class="quick-action-icon blue">
              <i class="bi bi-calendar3"></i>
            </div>
            <div class="quick-action-content">
              <h4>Mi Agenda</h4>
              <p>Ver calendario completo</p>
            </div>
            <i class="bi bi-arrow-right quick-action-arrow"></i>
          </a>

          <a class="quick-action-card" routerLink="/dashboard/history">
            <div class="quick-action-icon green">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="quick-action-content">
              <h4>Historial</h4>
              <p>Ver sesiones anteriores</p>
            </div>
            <i class="bi bi-arrow-right quick-action-arrow"></i>
          </a>

          <a class="quick-action-card" routerLink="/dashboard/profile">
            <div class="quick-action-icon orange">
              <i class="bi bi-person-gear"></i>
            </div>
            <div class="quick-action-content">
              <h4>Mi Perfil</h4>
              <p>Configurar preferencias</p>
            </div>
            <i class="bi bi-arrow-right quick-action-arrow"></i>
          </a>
        </div>
      </div>
    </div>

  `,
  styleUrl: './dashboard-home.css'
})
export class DashboardHome {
  // Estadísticas del usuario
  stats = {
    totalReservas: 12,
    completadas: 8,
    tasaCompletadas: 67,
    proximas: 3,
    calificacion: 5
  };

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
