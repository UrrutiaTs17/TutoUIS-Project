import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../calendar/calendar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  template: `
    <div class="section-content">
      <!-- Componente Calendar para buscar materias -->
      <app-calendar></app-calendar>

      <!-- Información importante -->
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
  `,
  styleUrl: './reservation-form.css'
})
export class ReservationForm {
  // El componente ahora solo muestra el buscador de materias y la información importante
  // La funcionalidad de reserva se maneja a través del modal del calendario
}
