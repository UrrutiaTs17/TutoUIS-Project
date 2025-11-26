import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, CreateReservaDto } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

interface Disponibilidad {
  idDisponibilidad: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  aforo: number;
  aforoMaximo: number;
  tutoria?: {
    nombreAsignatura: string;
    nombreTutor: string;
  };
}

interface SlotSeleccionado {
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-modal.html',
  styleUrl: './reservation-modal.css'
})
export class ReservationModal {
  @Input() disponibilidad!: Disponibilidad;
  @Input() slot!: SlotSeleccionado;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() reservationCreated = new EventEmitter<void>();

  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  formData = {
    horaInicio: '',
    horaFin: '',
    observaciones: '',
    modalidad: 'Presencial' as 'Presencial' | 'Virtual'
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    // Pre-llenar el formulario con el slot seleccionado
    if (this.slot) {
      this.formData.horaInicio = this.slot.inicio;
      this.formData.horaFin = this.slot.fin;
    }
  }

  selectModalidad(modalidad: 'Presencial' | 'Virtual'): void {
    this.formData.modalidad = modalidad;
  }

  calculateEndTime(): void {
    if (this.formData.horaInicio) {
      const [hours, minutes] = this.formData.horaInicio.split(':').map(Number);
      const inicio = new Date();
      inicio.setHours(hours, minutes, 0);
      
      // Agregar 15 minutos
      const fin = new Date(inicio.getTime() + 15 * 60000);
      
      const horasFin = String(fin.getHours()).padStart(2, '0');
      const minutosFin = String(fin.getMinutes()).padStart(2, '0');
      this.formData.horaFin = `${horasFin}:${minutosFin}`;
    }
  }

  getMinTime(): string {
    if (!this.disponibilidad?.horaInicio) return '';
    const horaInicio = this.disponibilidad.horaInicio;
    // Formato puede ser "HH:mm:ss" o "HH:mm"
    return horaInicio.substring(0, 5);
  }

  getMaxTime(): string {
    if (!this.disponibilidad?.horaFin) return '';
    const horaFin = this.disponibilidad.horaFin;
    // Formato puede ser "HH:mm:ss" o "HH:mm"
    // Restar 15 minutos para que la hora final no exceda
    const [hours, minutes] = horaFin.substring(0, 5).split(':').map(Number);
    const fin = new Date();
    fin.setHours(hours, minutes, 0);
    fin.setMinutes(fin.getMinutes() - 15);
    
    const horasMax = String(fin.getHours()).padStart(2, '0');
    const minutosMax = String(fin.getMinutes()).padStart(2, '0');
    return `${horasMax}:${minutosMax}`;
  }

  close(): void {
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (!this.formData.horaInicio || !this.formData.horaFin) {
      this.errorMessage = 'Por favor completa los campos requeridos';
      return;
    }

    const userData = this.authService.getUserData();
    if (!userData) {
      this.errorMessage = 'No se encontraron datos de sesión. Por favor inicia sesión nuevamente.';
      return;
    }

    const idUsuario = (userData as any).id_usuario || (userData as any).idUsuario;
    if (!idUsuario) {
      this.errorMessage = 'Datos de usuario incompletos. Por favor inicia sesión nuevamente.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const reservaData: CreateReservaDto = {
      idDisponibilidad: this.disponibilidad.idDisponibilidad,
      idEstudiante: idUsuario,
      horaInicio: this.formData.horaInicio + ':00',
      horaFin: this.formData.horaFin + ':00',
      modalidad: this.formData.modalidad,
      observaciones: this.formData.observaciones.trim() || undefined
    };

    console.log('📝 Creando reserva desde modal:', reservaData);

    this.reservationService.createReservation(reservaData).subscribe({
      next: (reserva) => {
        console.log('✅ Reserva creada exitosamente:', reserva);
        console.log('📅 Fecha de creación:', reserva.fechaCreacion);
        this.successMessage = '¡Reserva creada exitosamente!';
        this.isSubmitting = false;
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          this.reservationCreated.emit();
          this.close();
        }, 1500);
      },
      error: (error) => {
        console.error('❌ ERROR COMPLETO:', error);
        console.log('🔍 error.status:', error.status);
        console.log('🔍 error.error:', error.error);
        console.log('🔍 typeof error.error:', typeof error.error);
        
        // Extraer el mensaje de error
        let errorMsg = '';
        
        // Si error.error es un objeto con propiedad 'mensaje'
        if (error.error && typeof error.error === 'object' && error.error.mensaje) {
          errorMsg = error.error.mensaje;
          console.log('✅ Mensaje extraído de error.error.mensaje:', errorMsg);
        }
        // Si error.error es un objeto con propiedad 'message'
        else if (error.error && typeof error.error === 'object' && error.error.message) {
          errorMsg = error.error.message;
          console.log('✅ Mensaje extraído de error.error.message:', errorMsg);
        }
        // Si error.error es un string directamente
        else if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
          console.log('✅ Mensaje extraído de error.error (string):', errorMsg);
        }
        // Si viene en error.message
        else if (error.message) {
          errorMsg = error.message;
          console.log('✅ Mensaje extraído de error.message:', errorMsg);
        }
        
        console.log('� Mensaje final extraído:', errorMsg);
        
        // Si el error es 400 y tenemos mensaje del backend, mostrarlo
        if (error.status === 400 && errorMsg) {
          const errorMsgLower = errorMsg.toLowerCase();
          
          // Detectar el mensaje específico de reserva duplicada/conflicto de horario
          if (errorMsgLower.includes('ya tienes una reserva') || errorMsgLower.includes('reserva activa')) {
            this.errorMessage = '⚠️ Ya tienes una reserva en este horario. Por favor, selecciona otro espacio de tiempo.';
            console.log('✅ Mensaje de conflicto de horario establecido');
          }
          else if (errorMsgLower.includes('ya existe una reserva en este horario')) {
            this.errorMessage = '⚠️ Este horario ya está reservado. Por favor, selecciona otro espacio de tiempo disponible.';
            console.log('✅ Mensaje de horario ocupado establecido');
          } 
          else if (errorMsgLower.includes('ya existe')) {
            this.errorMessage = '⚠️ Este horario ya está ocupado. Por favor, selecciona otro espacio de tiempo disponible.';
            console.log('✅ Mensaje de horario ocupado establecido');
          } 
          else if (errorMsgLower.includes('rango') || errorMsgLower.includes('fuera')) {
            this.errorMessage = '⚠️ El horario seleccionado está fuera del rango de la disponibilidad.';
          } 
          else if (errorMsgLower.includes('15 minutos')) {
            this.errorMessage = '⚠️ La reserva debe ser de exactamente 15 minutos.';
          }
          else {
            // Mostrar el mensaje del backend directamente
            this.errorMessage = errorMsg;
            console.log('ℹ️ Mostrando mensaje del backend tal cual');
          }
        } 
        else {
          this.errorMessage = errorMsg || 'Error al crear la reserva. Por favor intenta de nuevo.';
          console.log('⚠️ Error sin mensaje específico');
        }
        
        console.log('📢 MENSAJE FINAL ESTABLECIDO:', this.errorMessage);
        this.isSubmitting = false;
        
        // Forzar detección de cambios para que Angular actualice la vista
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}

