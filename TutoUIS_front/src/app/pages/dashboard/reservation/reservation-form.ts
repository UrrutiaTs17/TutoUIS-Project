import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../calendar/calendar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  template: `
    <div class="section-content">
      <!-- Header Mejorado -->
      <div class="reservation-header">
        <div class="header-left">
          <div class="header-icon">
            <i class="bi bi-calendar-plus"></i>
          </div>
          <div class="header-text">
            <h1 class="page-title">Nueva Reserva de Tutoría</h1>
            <p class="page-subtitle">
              <i class="bi bi-lightning-charge"></i>
              Reserva rápido y fácil tu sesión de estudio
            </p>
          </div>
        </div>
        <div class="header-stats">
          <div class="mini-stat">
            <i class="bi bi-calendar-check"></i>
            <div>
              <span class="stat-num">{{ quickStats.disponibles }}</span>
              <span class="stat-text">Disponibles</span>
            </div>
          </div>
          <div class="mini-stat">
            <i class="bi bi-people"></i>
            <div>
              <span class="stat-num">{{ quickStats.tutores }}</span>
              <span class="stat-text">Tutores</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Proceso Visual Mejorado -->
      <div class="process-timeline">
        <div class="timeline-step active">
          <div class="step-icon">
            <i class="bi bi-search"></i>
          </div>
          <div class="step-info">
            <h4>Buscar</h4>
            <p>Materia</p>
          </div>
        </div>
        <div class="timeline-connector"></div>
        <div class="timeline-step">
          <div class="step-icon">
            <i class="bi bi-calendar3"></i>
          </div>
          <div class="step-info">
            <h4>Seleccionar</h4>
            <p>Horario</p>
          </div>
        </div>
        <div class="timeline-connector"></div>
        <div class="timeline-step">
          <div class="step-icon">
            <i class="bi bi-person-check"></i>
          </div>
          <div class="step-info">
            <h4>Confirmar</h4>
            <p>Reserva</p>
          </div>
        </div>
      </div>

      <!-- Contenedor principal con dos columnas -->
      <div class="main-grid">
        <!-- Columna izquierda: Calendar -->
        <div class="calendar-section">
          <div class="section-card">
            <div class="card-header">
              <h3>
                <i class="bi bi-calendar-week"></i>
                Buscar Tutorías Disponibles
              </h3>
              <span class="badge-live">
                <span class="live-dot"></span>
                En vivo
              </span>
            </div>
            <app-calendar></app-calendar>
          </div>
        </div>

        <!-- Columna derecha: Info y ayuda -->
        <div class="sidebar-section">
          <!-- Tips Card -->
          <div class="sidebar-card tips-card">
            <div class="card-title">
              <i class="bi bi-lightbulb-fill"></i>
              Consejos Rápidos
            </div>
            <div class="tips-list">
              <div class="tip-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Máximo <strong>4 horas</strong> por sesión</span>
              </div>
              <div class="tip-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Reserva hasta <strong>30 días</strong> antes</span>
              </div>
              <div class="tip-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Cancela con <strong>24h</strong> anticipación</span>
              </div>
              <div class="tip-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Máximo <strong>5 reservas</strong> activas</span>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div class="sidebar-card help-card">
            <div class="card-title">
              <i class="bi bi-question-circle-fill"></i>
              ¿Necesitas Ayuda?
            </div>
            <div class="help-content">
              <p>Si tienes problemas con tu reserva, contáctanos:</p>
              <div class="help-actions">
                <button class="help-btn">
                  <i class="bi bi-chat-dots"></i>
                  Chat en vivo
                </button>
                <button class="help-btn">
                  <i class="bi bi-envelope"></i>
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Mejorado -->
      <div class="faq-modern">
        <h3 class="faq-title">
          <i class="bi bi-patch-question"></i>
          Preguntas Frecuentes
        </h3>
        <div class="faq-accordion">
          <div class="faq-item-modern">
            <div class="faq-q">
              <i class="bi bi-arrow-return-right"></i>
              ¿Puedo cancelar mi reserva?
            </div>
            <p class="faq-a">Sí, puedes cancelar hasta 24 horas antes sin penalización.</p>
          </div>
          <div class="faq-item-modern">
            <div class="faq-q">
              <i class="bi bi-arrow-return-right"></i>
              ¿Qué pasa si llego tarde?
            </div>
            <p class="faq-a">Tienes 15 minutos de tolerancia antes de cancelación automática.</p>
          </div>
          <div class="faq-item-modern">
            <div class="faq-q">
              <i class="bi bi-arrow-return-right"></i>
              ¿Cómo contacto al tutor?
            </div>
            <p class="faq-a">Recibirás datos de contacto por email al confirmar.</p>
          </div>
          <div class="faq-item-modern">
            <div class="faq-q">
              <i class="bi bi-arrow-return-right"></i>
              ¿Cuántas reservas puedo hacer?
            </div>
            <p class="faq-a">Máximo 5 reservas activas simultáneamente.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './reservation-form.css'
})
export class ReservationForm {
  quickStats = {
    disponibles: 45,
    materias: 28,
    tutores: 18
  };
}
