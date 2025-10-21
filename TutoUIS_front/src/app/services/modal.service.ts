import { Injectable, ComponentRef, ViewContainerRef, TemplateRef, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<boolean>(false);
  public modal$ = this.modalSubject.asObservable();

  private modalElement: HTMLElement | null = null;

  showModal(): void {
    this.modalSubject.next(true);
    this.createModalElement();
  }

  hideModal(): void {
    this.modalSubject.next(false);
    this.removeModalElement();
  }

  private createModalElement(): void {
    if (this.modalElement) return;

    this.modalElement = document.createElement('div');
    this.modalElement.innerHTML = `
      <div class="modal-backdrop" style="
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        z-index: 9999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 20px;
        margin: 0 !important;
        pointer-events: auto !important;
      ">
        <div class="modal-content" style="
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          max-width: 500px !important;
          width: 90% !important;
          max-height: 85vh !important;
          overflow-y: auto !important;
          z-index: 10000 !important;
          position: relative !important;
          margin: 0 !important;
        ">
          <div class="modal-header" style="
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 12px 12px 0 0;
          ">
            <h5 class="modal-title" style="margin: 0; font-size: 1.1rem; font-weight: 600;">
              <i class="bi bi-calendar-plus me-2"></i>Crear Reserva
            </h5>
            <button type="button" class="btn-close" style="
              background: none;
              border: none;
              font-size: 1.25rem;
              color: white;
              cursor: pointer;
              padding: 0.25rem;
              border-radius: 50%;
              transition: background-color 0.2s;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
            " onclick="this.hideModal()">
              <i class="bi bi-x"></i>
            </button>
          </div>
          
          <div class="modal-body" style="padding: 1.5rem;">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="space" class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 0.5rem; font-size: 0.9rem;">Espacio de Estudio</label>
                  <select class="form-select" id="space" style="
                    border: 2px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                  " required>
                    <option value="">Selecciona un espacio...</option>
                    <option value="sala-b302">Sala de Estudio B-302</option>
                    <option value="cubículo-15">Cubículo Individual 15</option>
                    <option value="sala-a105">Sala Grupal A-105</option>
                    <option value="sala-c201">Sala C-201</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 0.5rem; font-size: 0.9rem;">Fecha</label>
                  <input type="date" class="form-control" id="date" style="
                    border: 2px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                  " required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="startTime" class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 0.5rem; font-size: 0.9rem;">Hora de Inicio</label>
                  <input type="time" class="form-control" id="startTime" style="
                    border: 2px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                  " required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="endTime" class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 0.5rem; font-size: 0.9rem;">Hora de Fin</label>
                  <input type="time" class="form-control" id="endTime" style="
                    border: 2px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                  " required>
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 0.5rem; font-size: 0.9rem;">Descripción (Opcional)</label>
                <textarea class="form-control" id="description" rows="3" style="
                  border: 2px solid #e9ecef;
                  border-radius: 6px;
                  padding: 0.6rem;
                  font-size: 0.9rem;
                  transition: border-color 0.2s, box-shadow 0.2s;
                " placeholder="Indica propósito de la reserva, notas especiales, etc."></textarea>
              </div>
            </form>
          </div>
          
          <div class="modal-footer" style="
            padding: 1rem 1.5rem;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            background-color: #f8f9fa;
            border-radius: 0 0 12px 12px;
          ">
            <button type="button" class="btn btn-outline-secondary" style="
              border-radius: 6px;
              font-weight: 600;
              padding: 0.6rem 1.2rem;
              font-size: 0.9rem;
              transition: all 0.2s;
              border: 2px solid #6c757d;
              color: #6c757d;
            " onclick="this.hideModal()">
              <i class="bi bi-x-circle me-2"></i>Cancelar
            </button>
            <button type="button" class="btn btn-success" style="
              border-radius: 6px;
              font-weight: 600;
              padding: 0.6rem 1.2rem;
              font-size: 0.9rem;
              transition: all 0.2s;
              background: linear-gradient(135deg, #28a745, #20c997);
              border: none;
            " onclick="this.submitForm()">
              <i class="bi bi-check-circle me-2"></i>Crear Reserva
            </button>
          </div>
        </div>
      </div>
    `;

    // Agregar event listeners
    const backdrop = this.modalElement.querySelector('.modal-backdrop');
    const closeBtn = this.modalElement.querySelector('.btn-close');
    const cancelBtn = this.modalElement.querySelector('.btn-outline-secondary');
    
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideModal());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideModal());
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hideModal());
    }

    document.body.appendChild(this.modalElement);
  }

  private removeModalElement(): void {
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
      this.modalElement = null;
    }
  }

  private submitForm(): void {
    console.log('Formulario enviado');
    alert('Reserva creada exitosamente!');
    this.hideModal();
  }
}

