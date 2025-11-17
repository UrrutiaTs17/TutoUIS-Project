import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../calendar/calendar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css'
})
export class ReservationForm {
  quickStats = {
    disponibles: 45,
    materias: 28,
    tutores: 18
  };
}
