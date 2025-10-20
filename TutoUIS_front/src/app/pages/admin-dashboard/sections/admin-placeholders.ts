import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-calendar-check me-2"></i>Gestión de Reservas
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-calendar-event"></i>
          <h5>Gestión de Reservas</h5>
          <p class="text-muted">Aquí se mostrará la lista completa de reservas del sistema</p>
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
export class AdminReservations {}

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
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-graph-up me-2"></i>Reportes y Estadísticas
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-file-earmark-text"></i>
          <h5>Reportes y Estadísticas</h5>
          <p class="text-muted">Aquí se mostrarán los reportes y análisis del sistema</p>
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
export class AdminReports {}

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
