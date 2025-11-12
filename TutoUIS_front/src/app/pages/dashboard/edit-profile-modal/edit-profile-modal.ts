import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="editProfileLabel">
              <i class="bi bi-pencil-square me-2"></i>Editar Perfil de Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            @if (isLoading) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando datos del usuario...</p>
              </div>
            } @else if (profileData) {
              <form (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label">NOMBRE</label>
                    <input
                      type="text"
                      class="form-control"
                      id="nombre"
                      [value]="profileData.nombre"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="apellido" class="form-label">APELLIDO</label>
                    <input
                      type="text"
                      class="form-control"
                      id="apellido"
                      [value]="profileData.apellido"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="codigo" class="form-label">CÓDIGO</label>
                    <input
                      type="text"
                      class="form-control"
                      id="codigo"
                      [value]="profileData.codigo"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="correo" class="form-label">CORREO ELECTRÓNICO <span class="text-danger">*</span></label>
                    <input
                      type="email"
                      class="form-control"
                      id="correo"
                      [(ngModel)]="profileData.correo"
                      name="correo"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="telefono" class="form-label">TELÉFONO</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="telefono"
                      [(ngModel)]="profileData.telefono"
                      name="telefono"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="id_rol" class="form-label">ROL</label>
                    <input
                      type="number"
                      class="form-control"
                      id="id_rol"
                      [value]="profileData.id_rol"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="id_carrera" class="form-label">CARRERA</label>
                    <input
                      type="number"
                      class="form-control"
                      id="id_carrera"
                      [value]="profileData.id_carrera"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="activo" class="form-label">ESTADO</label>
                    <input
                      type="text"
                      class="form-control"
                      id="activo"
                      [value]="profileData.activo ? 'Activo' : 'Inactivo'"
                      disabled
                    />
                    <small class="text-muted">Este campo no es editable</small>
                  </div>
                </div>

                @if (errorMessage) {
                  <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
                  </div>
                }

                <div class="modal-footer mt-4">
                  <button type="button" class="btn btn-secondary" (click)="closeModal()">
                    Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    @if (isSubmitting) {
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    } @else {
                      <i class="bi bi-check-circle me-2"></i>Guardar Cambios
                    }
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `,
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
