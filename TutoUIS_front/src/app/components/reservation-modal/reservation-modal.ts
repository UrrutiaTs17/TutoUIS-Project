import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, CreateReservaDto } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

interface Disponibilidad {
  idDisponibilidad: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  aforoDisponible: number;
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

  formData = {
    horaInicio: '',
    horaFin: '',
    observaciones: ''
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
        console.error('❌ Error al crear reserva:', error);
        console.log('🔍 Depurando error:');
        console.log('  - error.status:', error.status);
        console.log('  - error.error:', error.error);
        console.log('  - error.error.mensaje:', error.error?.mensaje);
        console.log('  - error.message:', error.message);
        
        // Detectar error de horario ocupado
        const errorMsg = error.error?.mensaje || error.error?.message || error.message || '';
        console.log('  - errorMsg final:', errorMsg);
        
        // Verificar si es un error de horario ya ocupado
        if (errorMsg.toLowerCase().includes('ya existe una reserva')) {
          console.log('✅ Detectado: horario ocupado');
          this.errorMessage = '⚠️ Este horario ya está ocupado. Por favor selecciona otro espacio de tiempo disponible.';
        } else if (error.status === 400 || error.status === 409) {
          console.log('⚠️ Error 400/409 detectado');
          // Otros errores de validación
          if (errorMsg.toLowerCase().includes('cupo')) {
            this.errorMessage = '⚠️ No hay cupos disponibles para esta tutoría.';
          } else if (errorMsg.toLowerCase().includes('rango') || errorMsg.toLowerCase().includes('dentro')) {
            this.errorMessage = '⚠️ El horario seleccionado está fuera del rango de la disponibilidad.';
          } else if (errorMsg.toLowerCase().includes('15 minutos')) {
            this.errorMessage = '⚠️ La reserva debe ser de exactamente 15 minutos.';
          } else {
            this.errorMessage = errorMsg || 'No se pudo crear la reserva. Verifica los datos ingresados.';
          }
        } else if (error.status === 405) {
          // Método no soportado
          this.errorMessage = 'Error en la comunicación con el servidor. Inténtalo de nuevo.';
        } else {
          this.errorMessage = errorMsg || 'Error al crear la reserva. Inténtalo de nuevo.';
        }
        
        console.log('📢 Mensaje de error establecido:', this.errorMessage);
        this.isSubmitting = false;
      }
    });
  }
}

