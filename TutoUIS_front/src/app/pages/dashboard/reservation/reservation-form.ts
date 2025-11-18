import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent, CalendarStats } from '../../calendar/calendar';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css'
})
export class ReservationForm implements OnInit {
  quickStats = {
    disponibles: 0,
    tutores: 0
  };

  loadingStats = true;

  ngOnInit(): void {
    console.log('🎯 ReservationForm: Componente inicializado');
    console.log('🎯 ReservationForm: loadingStats =', this.loadingStats);
    console.log('🎯 ReservationForm: quickStats =', this.quickStats);
  }

  /**
   * Recibe las estadísticas del componente calendario
   */
  onStatsLoaded(stats: CalendarStats): void {
    console.log('📊 ReservationForm: ¡Evento statsLoaded recibido!');
    console.log('📊 ReservationForm: Stats antes de actualizar:', this.quickStats);
    console.log('📊 ReservationForm: Stats recibidas:', stats);
    
    this.quickStats = stats;
    this.loadingStats = false;
    
    console.log('📊 ReservationForm: Stats después de actualizar:', this.quickStats);
    console.log('📊 ReservationForm: loadingStats =', this.loadingStats);
  }
}

