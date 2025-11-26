import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.css'
})
export class EditProfileModalComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<any>();
  
  profileData: any = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        this.errorMessage = 'Error al cargar los datos del usuario';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.profileData) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    // No enviar la contraseña en la actualización
    // Solo enviar los campos editables (teléfono y correo)
    const dataToUpdate = {
      ...this.profileData,
      telefono: this.profileData.telefono,
      correo: this.profileData.correo
    };

    this.authService.updateUserProfile(dataToUpdate).subscribe({
      next: (response) => {
        // stop spinner and emit update
        this.isSubmitting = false;
        this.profileUpdated.emit(response);

        // force change detection so the UI removes the spinner before the blocking alert
        try {
          this.cd.detectChanges();
        } catch (e) {
          console.debug('detectChanges failed or unnecessary', e);
        }

        // show alert after UI updated; close modal after user accepts
        setTimeout(() => {
          alert('Perfil actualizado correctamente');
          this.closeModal();
        }, 0);
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        this.errorMessage = error.error?.message || 'Error al actualizar el perfil';
        this.isSubmitting = false;
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const bs = (window as any).bootstrap;
      try {
        const bootstrapModal = bs?.Modal?.getInstance(modalElement);
        if (bootstrapModal) {
          bootstrapModal.hide();
          return;
        }

        if (bs && bs.Modal) {
          const temp = new bs.Modal(modalElement);
          temp.hide();
          return;
        }
      } catch (e) {
        console.warn('Error closing bootstrap modal via API, falling back to DOM cleanup', e);
      }

      // Fallback DOM cleanup
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('role');
      document.body.classList.remove('modal-open');
      const backdrops = Array.from(document.getElementsByClassName('modal-backdrop'));
      backdrops.forEach((b) => b.parentNode?.removeChild(b));
    }
  }

  openModal(): void {
    this.loadProfileData();
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }
}
