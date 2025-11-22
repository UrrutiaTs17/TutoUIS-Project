import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateTutoriaModal } from '../../../components/create-tutoria-modal/create-tutoria-modal';
import { EditTutoriaModal } from '../../../components/edit-tutoria-modal/edit-tutoria-modal';
import { TutoriaService, Tutoria } from '../../../services/tutoria.service';

@Component({
  selector: 'app-admin-tutorias',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateTutoriaModal, EditTutoriaModal],
  templateUrl: './admin-tutorias.html',
  styleUrl: './admin-tutorias.css'
})
export class AdminTutorias implements OnInit {
  
  @ViewChild('createModal') createTutoriaModal?: CreateTutoriaModal;
  @ViewChild('editModal') editTutoriaModal?: EditTutoriaModal;
  
  // Listas
  tutorias: Tutoria[] = [];
  tutoriasFiltradas: Tutoria[] = [];
  
  // Estados
  loading: boolean = true;
  error: string = '';
  successMessage: string = '';
  
  // Filtros
  searchTerm: string = '';
  filterTutor: string = '';
  filterCarrera: string = '';
  
  constructor(
    private tutoriaService: TutoriaService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    console.log('🎬 AdminTutorias ngOnInit - Iniciando carga de tutorías');
    console.log('⏳ Estado inicial loading:', this.loading);
    
    this.cargarTutorias();
    
    // Timeout de seguridad - si después de 15 segundos aún está cargando, forzar a mostrar algo
    setTimeout(() => {
      if (this.loading) {
        console.warn('⚠️ TIMEOUT: Han pasado 15 segundos y aún está loading=true');
        console.warn('⚠️ Forzando loading=false para evitar spinner infinito');
        this.loading = false;
        this.error = 'Timeout: La carga de tutorías está tardando demasiado. Verifica que el backend esté respondiendo.';
        this.cdr.detectChanges();
        console.log('🔄 Change detection forzada después del timeout');
      }
    }, 15000);
  }
  
  /**
   * Carga todas las tutorías desde el backend
   */
  cargarTutorias(): void {
    console.log('🔄 AdminTutorias: Cargando tutorías desde el backend...');
    this.loading = true;
    this.error = '';
    console.log('⏳ AdminTutorias: loading=true antes de llamar al servicio');
    
    this.tutoriaService.getAllTutorias().subscribe({
      next: (data) => {
        console.log('✅ AdminTutorias: Tutorías recibidas desde el servicio');
        console.log('📊 AdminTutorias: Cantidad de tutorías:', data.length);
        console.log('📦 AdminTutorias: Primera tutoría (si existe):', data[0]);
        
        this.tutorias = data;
        this.aplicarFiltros();
        this.loading = false;
        
        console.log('✅ AdminTutorias: loading=false después de recibir datos');
        console.log('✅ AdminTutorias: tutoriasFiltradas.length =', this.tutoriasFiltradas.length);
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
        console.log('🔄 AdminTutorias: Change detection forzada');
      },
      error: (error) => {
        console.error('❌ AdminTutorias: Error cargando tutorías:', error);
        console.error('❌ AdminTutorias: Status:', error.status);
        console.error('❌ AdminTutorias: Message:', error.message);
        
        if (error.status === 0) {
          this.error = '❌ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080';
        } else if (error.status === 404) {
          this.error = '❌ Endpoint no encontrado. Verifica la URL del API (/api/tutorias/list).';
        } else if (error.status === 401 || error.status === 403) {
          this.error = '❌ No tienes permisos para ver las tutorías. Verifica tu token de autenticación.';
        } else {
          this.error = `❌ Error al cargar las tutorías: ${error.message || 'Error desconocido'}`;
        }
        
        this.loading = false;
        console.log('✅ AdminTutorias: Error manejado, loading=false');
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
        console.log('🔄 AdminTutorias: Change detection forzada después del error');
      }
    });
  }
  
  /**
   * Aplica los filtros a la lista de tutorías
   */
  aplicarFiltros(): void {
    this.tutoriasFiltradas = this.tutorias.filter(tutoria => {
      const nombre = tutoria.nombre || '';
      const nombreTutor = tutoria.nombreTutor || '';
      const nombreCarrera = tutoria.nombreCarrera || '';
      
      const coincideNombre = nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
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
   * Edita una tutoría (abre el modal de edición)
   */
  editarTutoria(tutoria: Tutoria): void {
    console.log('📝 Abriendo modal de edición para:', tutoria);
    if (this.editTutoriaModal) {
      this.editTutoriaModal.open(tutoria);
    } else {
      console.error('❌ EditTutoriaModal no está disponible');
    }
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
          this.error = error?.error?.mensaje || 'Error al eliminar la tutoría';
          setTimeout(() => {
            this.error = '';
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
