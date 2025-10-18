import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CalendarComponent } from '../../calendar/calendar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CalendarComponent],
  template: `
    <div class="section-content">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-calendar-plus me-2"></i>Crear Nueva Reserva
          </h5>
        </div>
        <div class="card-body">
          <!-- Componente Calendar para seleccionar tutoría -->
          <div class="calendar-section mb-4">
            <h6 class="section-subtitle mb-3">
              <i class="bi bi-calendar2-event me-2"></i>Paso 1: Selecciona una Tutoría Disponible
            </h6>
            <app-calendar></app-calendar>
          </div>

          <!-- Formulario de Reserva -->
          <div class="form-section mt-4">
            <h6 class="section-subtitle mb-3">
              <i class="bi bi-form-check me-2"></i>Paso 2: Completa tu Reserva
            </h6>
            <form (ngSubmit)="onSubmit()">
              <div class="row">
                <!-- Seleccionar Espacio -->
                <div class="col-md-6 mb-3">
                  <label for="space" class="form-label">Espacio de Estudio</label>
                  <select 
                    class="form-select" 
                    id="space" 
                    [(ngModel)]="formData.space" 
                    name="space"
                    required>
                    <option value="">Selecciona un espacio...</option>
                    <option value="sala-b302">Sala de Estudio B-302</option>
                    <option value="cubículo-15">Cubículo Individual 15</option>
                    <option value="sala-a105">Sala Grupal A-105</option>
                    <option value="sala-c201">Sala C-201</option>
                  </select>
                </div>

                <!-- Fecha -->
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Fecha</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="date" 
                    [(ngModel)]="formData.date" 
                    name="date"
                    required>
                </div>
              </div>

              <div class="row">
                <!-- Hora de inicio -->
                <div class="col-md-6 mb-3">
                  <label for="startTime" class="form-label">Hora de Inicio</label>
                  <input 
                    type="time" 
                    class="form-control" 
                    id="startTime" 
                    [(ngModel)]="formData.startTime" 
                    name="startTime"
                    required>
                </div>

                <!-- Hora de fin -->
                <div class="col-md-6 mb-3">
                  <label for="endTime" class="form-label">Hora de Fin</label>
                  <input 
                    type="time" 
                    class="form-control" 
                    id="endTime" 
                    [(ngModel)]="formData.endTime" 
                    name="endTime"
                    required>
                </div>
              </div>

              <!-- Descripción (opcional) -->
              <div class="mb-3">
                <label for="description" class="form-label">Descripción (Opcional)</label>
                <textarea 
                  class="form-control" 
                  id="description" 
                  rows="3"
                  [(ngModel)]="formData.description" 
                  name="description"
                  placeholder="Indica propósito de la reserva, notas especiales, etc."></textarea>
              </div>

              <!-- Botones de acción -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success">
                  <i class="bi bi-check-circle me-2"></i>Crear Reserva
                </button>
                <a routerLink="/dashboard" class="btn btn-outline-secondary">
                  <i class="bi bi-x-circle me-2"></i>Cancelar
                </a>
              </div>
            </form>

            <!-- Información útil -->
            <div class="alert alert-info mt-4">
              <h6 class="alert-heading">
                <i class="bi bi-info-circle me-2"></i>Información importante
              </h6>
              <ul class="mb-0">
                <li>Las reservas son por un máximo de 4 horas</li>
                <li>Puedes reservar con hasta 30 días de anticipación</li>
                <li>Cancela con al menos 24 horas de anticipación</li>
                <li>Recuerda que no puedes tener reservas superpuestas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './reservation-form.css'
})
export class ReservationForm {
  formData = {
    space: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  };

  onSubmit(): void {
    console.log('Formulario enviado:', this.formData);
    // Aquí irá la lógica para guardar la reserva
    alert('Reserva creada exitosamente!');
  }
}
