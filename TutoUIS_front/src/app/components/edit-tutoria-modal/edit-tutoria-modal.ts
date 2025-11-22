import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService } from '../../services/tutoria.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';

// Interfaz para Disponibilidad
interface Disponibilidad {
  idDisponibilidad?: number;
  diaSemana: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-edit-tutoria-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-tutoria-modal.html',
  styleUrl: './edit-tutoria-modal.css'
})
export class EditTutoriaModal implements OnInit, AfterViewInit {
  @ViewChild('editTutoriaModal', { static: false }) modal!: ElementRef;
  @Output() tutoriaUpdated = new EventEmitter<any>();

  // Referencia del modal de Bootstrap
  private bootstrapModal: any;

  // ID de la tutoría que se está editando
  tutoriaId: number | null = null;

  // Datos de la tutoría (solo lectura para los campos no editables)
  tutoriaInfo: any = null;

  // Datos editables del formulario
  form = {
    descripcion: '',
    ubicacion: ''
  };

  // Disponibilidades de la tutoría
  disponibilidades: Disponibilidad[] = [];

  // Estados del modal
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private tutoriaService: TutoriaService,
    private disponibilidadService: DisponibilidadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 Inicializando EditTutoriaModal...');
  }

  ngAfterViewInit(): void {
    console.log('🎬 EditTutoriaModal ngAfterViewInit');
    // Inicializar el modal de Bootstrap
    const modalElement = this.modal?.nativeElement;
    console.log('📦 Modal element:', modalElement);
    
    if (modalElement) {
      this.bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      console.log('✅ Bootstrap modal inicializado:', this.bootstrapModal);
      
      // Limpiar el formulario cuando se cierre el modal
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    } else {
      console.error('❌ No se pudo encontrar el elemento del modal');
    }
  }

  /**
   * Abre el modal para editar una tutoría
   */
  open(tutoria: any): void {
    console.log('📝 Abriendo modal de EDICIÓN para tutoría:', tutoria);
    
    this.tutoriaId = tutoria.idTutoria;
    this.tutoriaInfo = tutoria;
    
    // Cargar datos editables
    this.form = {
      descripcion: tutoria.descripcion || '',
      ubicacion: tutoria.ubicacion || tutoria.lugar || ''
    };

    // Inicializar disponibilidades vacías
    this.disponibilidades = [];
    this.loading = true;
    this.errorMessage = '';

    // PRIMERO mostrar el modal
    console.log('🎭 Mostrando modal de edición');
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
      console.log('✅ Modal mostrado');
    } else {
      console.error('❌ bootstrapModal no está disponible');
    }
    
    // DESPUÉS cargar disponibilidades
    console.log('🔍 Cargando disponibilidades para tutoría:', tutoria.idTutoria);
    
    this.disponibilidadService.getDisponibilidadesByTutoria(tutoria.idTutoria).subscribe({
      next: (disponibilidades: any) => {
        console.log('✅ Disponibilidades recibidas del backend:', disponibilidades);
        
        if (Array.isArray(disponibilidades) && disponibilidades.length > 0) {
          this.disponibilidades = disponibilidades.map((disp: any) => ({
            idDisponibilidad: disp.idDisponibilidad,
            diaSemana: disp.diaSemana,
            fecha: disp.fecha,
            horaInicio: disp.horaInicio ? disp.horaInicio.substring(0, 5) : '', // HH:mm
            horaFin: disp.horaFin ? disp.horaFin.substring(0, 5) : '' // HH:mm
          }));
          console.log('📋 Disponibilidades mapeadas:', this.disponibilidades);
        } else {
          console.warn('⚠️ No se encontraron disponibilidades');
          this.disponibilidades = [];
        }
        
        // Completar carga y forzar detección de cambios
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Carga completada, loading=false, disponibilidades.length=', this.disponibilidades.length);
      },
      error: (error: any) => {
        console.error('❌ Error cargando disponibilidades:', error);
        this.errorMessage = 'Error al cargar las disponibilidades';
        this.disponibilidades = [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('❌ Error manejado, loading=false');
      }
    });
  }

  /**
   * Agregar una nueva disponibilidad
   */
  agregarDisponibilidad(): void {
    const nuevaDisponibilidad: Disponibilidad = {
      diaSemana: '',
      fecha: '',
      horaInicio: '',
      horaFin: ''
    };
    this.disponibilidades.push(nuevaDisponibilidad);
  }

  /**
   * Eliminar una disponibilidad por índice
   */
  eliminarDisponibilidad(index: number): void {
    if (confirm('¿Estás seguro de eliminar esta disponibilidad?')) {
      this.disponibilidades.splice(index, 1);
    }
  }

  /**
   * Guardar cambios de la tutoría
   */
  submitForm(): void {
    console.log('📝 Guardando cambios de tutoría...');
    console.log('📋 Datos del formulario:', this.form);
    console.log('📅 Disponibilidades:', this.disponibilidades);

    // Validaciones
    if (this.disponibilidades.length === 0) {
      this.errorMessage = 'Debe haber al menos una disponibilidad';
      return;
    }

    // Validar que todas las disponibilidades estén completas
    for (let i = 0; i < this.disponibilidades.length; i++) {
      const disp = this.disponibilidades[i];
      if (!disp.diaSemana || !disp.fecha || !disp.horaInicio || !disp.horaFin) {
        this.errorMessage = `La disponibilidad ${i + 1} tiene campos incompletos`;
        return;
      }
      // Validar que hora fin sea mayor que hora inicio
      if (disp.horaInicio >= disp.horaFin) {
        this.errorMessage = `La disponibilidad ${i + 1}: la hora de fin debe ser mayor que la hora de inicio`;
        return;
      }
    }

    this.submitting = true;
    this.errorMessage = '';

    // Preparar DTO para actualización
    const updateDto: any = {
      descripcion: this.form.descripcion.trim() || undefined,
      ubicacion: this.form.ubicacion.trim() || undefined,
      disponibilidades: this.disponibilidades.map(disp => ({
        idDisponibilidad: disp.idDisponibilidad,
        diaSemana: disp.diaSemana,
        fecha: disp.fecha,
        horaInicio: disp.horaInicio + ':00', // Agregar segundos
        horaFin: disp.horaFin + ':00' // Agregar segundos
      }))
    };

    console.log('📦 DTO de actualización:', updateDto);

    // Llamar al servicio para actualizar
    this.tutoriaService.updateTutoriaEditable(this.tutoriaId!, updateDto).subscribe({
      next: (tutoria) => {
        console.log('✅ Tutoría actualizada exitosamente:', tutoria);
        this.successMessage = '✓ Tutoría actualizada exitosamente';
        this.submitting = false;
        
        // Emitir evento para que el componente padre actualice la lista
        this.tutoriaUpdated.emit(tutoria);
        
        // Mostrar alert y cerrar modal
        setTimeout(() => {
          alert('✓ Tutoría actualizada exitosamente');
          this.close();
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error actualizando tutoría:', error);
        
        let errorMsg = 'Error al actualizar la tutoría';
        if (error.status === 0) {
          errorMsg = '❌ No se puede conectar con el servidor';
        } else if (error.status === 400) {
          errorMsg = error.error?.mensaje || 'Datos inválidos';
        } else if (error.status === 401 || error.status === 403) {
          errorMsg = '❌ No tienes permisos para editar tutorías';
        } else if (error.error?.mensaje) {
          errorMsg = error.error.mensaje;
        }
        
        this.errorMessage = errorMsg;
        this.submitting = false;
      }
    });
  }

  /**
   * Cierra el modal
   */
  close(): void {
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.tutoriaId = null;
    this.tutoriaInfo = null;
    this.form = {
      descripcion: '',
      ubicacion: ''
    };
    this.disponibilidades = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = false;
    this.submitting = false;
  }
}
