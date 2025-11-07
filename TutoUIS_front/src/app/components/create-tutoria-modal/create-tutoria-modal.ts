import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService, Carrera, TutorInfo, CreateTutoriaDto } from '../../services/tutoria.service';
import { AdminService, Usuario } from '../../services/admin.service';

@Component({
  selector: 'app-create-tutoria-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tutoria-modal.html',
  styleUrl: './create-tutoria-modal.css'
})
export class CreateTutoriaModal implements OnInit {
  @ViewChild('createTutoriaModal') modal!: ElementRef;
  @Output() tutoriaCreated = new EventEmitter<any>();

  // Referencia del modal de Bootstrap
  private bootstrapModal: any;

  // Datos del formulario
  form = {
    idTutor: '',
    idCarrera: '',
    nombre: '',
    descripcion: '',
    capacidadMaxima: 30,
    ubicacion: ''
  };

  // Listas para los dropdowns
  tutores: TutorInfo[] = [];
  carreras: Carrera[] = [];

  // Estados del modal
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private tutoriaService: TutoriaService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadTutores();
    this.loadCarreras();
  }

  ngAfterViewInit(): void {
    // Inicializar el modal de Bootstrap
    const modalElement = this.modal?.nativeElement;
    if (modalElement) {
      this.bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      
      // Limpiar el formulario cuando se cierre el modal
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  /**
   * Carga la lista de tutores disponibles
   */
  loadTutores(): void {
    this.loading = true;
    this.tutoriaService.getTutores().subscribe({
      next: (data) => {
        // Filtrar solo los tutores (rol id = 2)
        this.tutores = data.filter((user: any) => user.idRol === 2 || user.rol?.idRol === 2);
        console.log('Tutores cargados:', this.tutores);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando tutores:', error);
        this.errorMessage = 'Error al cargar la lista de tutores';
        this.loading = false;
      }
    });
  }

  /**
   * Carga la lista de carreras disponibles
   */
  loadCarreras(): void {
    this.tutoriaService.getAllCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        console.log('Carreras cargadas:', this.carreras);
      },
      error: (error) => {
        console.error('Error cargando carreras:', error);
        this.errorMessage = 'Error al cargar la lista de carreras';
      }
    });
  }

  /**
   * Abre el modal
   */
  open(): void {
    this.resetForm();
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
    }
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
   * Envía el formulario para crear una nueva tutoría
   */
  submitForm(): void {
    // Validaciones
    if (!this.form.idTutor) {
      this.errorMessage = 'Por favor selecciona un tutor';
      return;
    }
    if (!this.form.idCarrera) {
      this.errorMessage = 'Por favor selecciona una carrera';
      return;
    }
    if (!this.form.nombre.trim()) {
      this.errorMessage = 'Por favor ingresa un nombre para la tutoría';
      return;
    }
    if (this.form.capacidadMaxima < 1) {
      this.errorMessage = 'La capacidad máxima debe ser mayor a 0';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const tutoriaDto: CreateTutoriaDto = {
      idTutor: parseInt(this.form.idTutor),
      idCarrera: parseInt(this.form.idCarrera),
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || undefined,
      capacidadMaxima: this.form.capacidadMaxima,
      ubicacion: this.form.ubicacion.trim() || undefined
    };

    this.tutoriaService.createTutoria(tutoriaDto).subscribe({
      next: (tutoria) => {
        this.successMessage = '✓ Tutoría creada exitosamente';
        this.submitting = false;
        
        // Emitir evento para que el componente padre actualice la lista
        this.tutoriaCreated.emit(tutoria);
        
        // Cerrar el modal después de 1 segundo
        setTimeout(() => {
          this.close();
          this.successMessage = '';
        }, 1000);
      },
      error: (error) => {
        console.error('Error creando tutoría:', error);
        this.errorMessage = error?.error?.mensaje || 'Error al crear la tutoría';
        this.submitting = false;
      }
    });
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.form = {
      idTutor: '',
      idCarrera: '',
      nombre: '',
      descripcion: '',
      capacidadMaxima: 30,
      ubicacion: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Obtiene el nombre del tutor por ID
   */
  getNombreTutor(idTutor: string): string {
    const tutor = this.tutores.find(t => t.idUsuario.toString() === idTutor);
    return tutor ? `${tutor.nombre} ${tutor.apellido}` : '';
  }

  /**
   * Obtiene el nombre de la carrera por ID
   */
  getNombreCarrera(idCarrera: string): string {
    const carrera = this.carreras.find(c => c.idCarrera.toString() === idCarrera);
    return carrera ? carrera.nombre : '';
  }
}
