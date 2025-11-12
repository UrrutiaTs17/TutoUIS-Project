import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateTutoriaModal } from '../../../components/create-tutoria-modal/create-tutoria-modal';
import { TutoriaService, Tutoria } from '../../../services/tutoria.service';

@Component({
  selector: 'app-admin-tutorias',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateTutoriaModal],
  templateUrl: './admin-tutorias.html',
  styleUrl: './admin-tutorias.css'
})
export class AdminTutorias implements OnInit {
  
  @ViewChild('createModal') createTutoriaModal?: CreateTutoriaModal;
  
  // Listas
  tutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];
  
  // Estados
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Filtros
  searchTerm: string = '';
  filterTutor: string = '';
  filterCarrera: string = '';
  
  constructor(private tutoriaService: TutoriaService) {}
  
  ngOnInit(): void {
    this.cargarTutorias();
  }
  
  /**
   * Carga todas las tutorías desde el backend
   */
  cargarTutorias(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.tutoriaService.getAllTutorias().subscribe({
      next: (data) => {
        this.tutorias = data || [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando tutorías:', error);
        // Si hay error de conexión, mostrar lista vacía en lugar de error
        this.tutorias = [];
        this.tutoriasFiltradas = [];
        this.loading = false;
        
        // Solo mostrar mensaje de error si no es un error de red
        if (error.status !== 0 && error.status !== 404) {
          this.errorMessage = 'Error al cargar las tutorías';
        }
      }
    });
  }
  
  /**
   * Aplica los filtros a la lista de tutorías
   */
  aplicarFiltros(): void {
    this.tutoriasFiltradas = this.tutorias.filter(tutoria => {
      const coincideNombre = tutoria.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const nombreTutor = tutoria.nombreTutor || '';
      const nombreCarrera = tutoria.nombreCarrera || '';
      const coincideTutor = this.filterTutor === '' || nombreTutor.toLowerCase().includes(this.filterTutor.toLowerCase());
      const coincideCarrera = this.filterCarrera === '' || nombreCarrera.toLowerCase().includes(this.filterCarrera.toLowerCase());
      
      return coincideNombre && coincideTutor && coincideCarrera;
    });
  }
  
  /**
   * Busca tutorías mientras se escribe
   */
  onSearchChange(): void {
    this.aplicarFiltros();
  }
  
  /**
   * Abre el modal para crear una nueva tutoría
   */
  abrirModalCrear(): void {
    if (this.createTutoriaModal) {
      this.createTutoriaModal.open();
    }
  }
  
  /**
   * Maneja cuando se crea una nueva tutoría
   */
  onTutoriaCreated(tutoria: any): void {
    this.successMessage = '✓ Tutoría creada exitosamente';
    setTimeout(() => {
      this.successMessage = '';
      this.cargarTutorias();
    }, 1500);
  }
  
  /**
   * Elimina una tutoría
   */
  eliminarTutoria(id: number, nombre: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la tutoría "${nombre}"?`)) {
      this.tutoriaService.deleteTutoria(id).subscribe({
        next: () => {
          this.successMessage = '✓ Tutoría eliminada exitosamente';
          setTimeout(() => {
            this.successMessage = '';
            this.cargarTutorias();
          }, 1500);
        },
        error: (error) => {
          console.error('Error eliminando tutoría:', error);
          this.errorMessage = error?.error?.mensaje || 'Error al eliminar la tutoría';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }
  
  /**
   * Obtiene el nombre del estado como texto
   */
  getNombreEstado(estado: number): string {
    return estado === 1 ? 'Activa' : 'Inactiva';
  }
  
  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getClaseEstado(estado: number): string {
    return estado === 1 ? 'badge bg-success' : 'badge bg-secondary';
  }
}
