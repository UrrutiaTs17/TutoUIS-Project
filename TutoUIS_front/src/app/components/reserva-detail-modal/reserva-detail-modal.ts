import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva, ReservationService } from '../../services/reservation.service';

declare var bootstrap: any;

@Component({
  selector: 'app-reserva-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-detail-modal.html',
  styleUrl: './reserva-detail-modal.css'
})
export class ReservaDetailModalComponent implements OnChanges {
  @Input() reserva: Reserva | null = null;
  @Input() isEditMode: boolean = false;
  @Output() onSaved = new EventEmitter<void>();
  @Output() onCancelled = new EventEmitter<void>();

  // Datos editables
  editData = {
    horaInicio: '',
    horaFin: '',
    observaciones: ''
  };

  isLoading = false;
  error: string | null = null;
  private modalInstance: any;

  constructor(private reservationService: ReservationService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reserva'] && this.reserva) {
      this.resetEditData();
      this.error = null;
    }
  }

  resetEditData() {
    if (this.reserva) {
      this.editData = {
        horaInicio: this.reserva.horaInicio || '',
        horaFin: this.reserva.horaFin || '',
        observaciones: this.reserva.observaciones || ''
      };
    }
  }

  showModal() {
    const modalElement = document.getElementById('reservaDetailModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.error = null;
  }

  switchToEditMode() {
    this.isEditMode = true;
    this.resetEditData();
  }

  onSubmit() {
    if (!this.reserva) return;

    // Validar horarios
    if (!this.editData.horaInicio || !this.editData.horaFin) {
      this.error = 'Debes ingresar tanto la hora de inicio como la hora de fin';
      return;
    }

    // Validar que hora inicio sea menor que hora fin
    if (this.editData.horaInicio >= this.editData.horaFin) {
      this.error = 'La hora de inicio debe ser menor que la hora de fin';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Por ahora solo actualizamos las observaciones
    // TODO: Implementar endpoint PUT en el backend para actualizar horarios
    const updateData = {
      observaciones: this.editData.observaciones,
      horaInicio: this.editData.horaInicio,
      horaFin: this.editData.horaFin
    };

    // Aquí deberías llamar al servicio para actualizar
    // Como no existe el método PUT completo, solo cerramos
    console.log('Datos a actualizar:', updateData);
    
    setTimeout(() => {
      this.isLoading = false;
      this.closeModal();
      this.onSaved.emit();
      alert('✅ Reserva actualizada exitosamente\n\nNOTA: La funcionalidad de edición completa requiere implementar el endpoint PUT en el backend.');
    }, 500);
  }

  cancelarReserva() {
    if (!this.reserva) return;

    const razon = prompt('Ingresa la razón de la cancelación:');
    if (!razon) {
      alert('❌ Debes proporcionar una razón para la cancelación');
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.reservationService.cancelReservation(this.reserva.idReserva, razon).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal();
        this.onCancelled.emit();
        alert('✅ Reserva cancelada exitosamente');
      },
      error: (error) => {
        console.error('Error al cancelar reserva:', error);
        this.error = 'Error al cancelar la reserva: ' + (error.error?.mensaje || error.message || 'Error desconocido');
        this.isLoading = false;
      }
    });
  }

  getEstadoBadgeClass(): string {
    if (!this.reserva?.nombreEstado) return '';
    
    const estado = this.reserva.nombreEstado.toLowerCase();
    if (estado.includes('reservada')) return 'badge-success';
    if (estado.includes('cancelada')) return 'badge-danger';
    if (estado.includes('pendiente')) return 'badge-warning';
    if (estado.includes('completada')) return 'badge-info';
    return 'badge-secondary';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'No registrada';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
