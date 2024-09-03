/*Error identificado: ómo se maneja el almacenamiento y la recuperación del usuario autenticado en el servicio UsuarioService*/
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { ExperienciaService } from "../experiencia.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UsuarioService } from "../../../Admin/Usuarios/usuario.service";

interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
}

interface Destinos {
  id: number;
  destinoName: string;
}

interface Experiencia {
  id: number;
  calificacion: string;
  comentario: string;
  fecha: string;
  usuario: Usuario;
  destinos: Destinos;
}

@Component({
  providers: [ExperienciaService, HttpClient, UsuarioService],
  selector: 'app-nueva-experiencia',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './nueva-experiencia.component.html',
  styleUrl: './nueva-experiencia.component.css'
})
export class NuevaExperienciaComponent implements OnInit {
  crearForm!: FormGroup;
  experiencias!: Experiencia;
  usuarios: Usuario[] = [];
  destinos: Destinos[] = [];
  isSubmitting: boolean = false;
  currentUser: Usuario | null = null;
  fecha: any;
  comentario: any;
  calificacion: any;

  constructor(
    private formBuilder: FormBuilder,
    private experienciaService: ExperienciaService,
    private router: Router,
    private usuariosService: UsuarioService,
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado al iniciar el componente
    this.currentUser = this.usuariosService.getCurrentUser();
    if (!this.currentUser) {
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para registrar una experiencia.', 'warning')
        .then(() => {
          this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
        });
      return; // Detiene la ejecución del componente si no está autenticado
    }

    // Inicializar el formulario si el usuario está autenticado
    this.crearForm = this.formBuilder.group({
      comentario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      destinos: ['', [Validators.required]],
      calificacion: ['', Validators.required]
    });

    this.cargarDestinos();
  }

  cargarDestinos(): void {
    this.experienciaService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) => {
        this.destinos = destinos;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    // Verificar si el usuario está autenticado
    if (!this.currentUser) {
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para guardar una experiencia.', 'error');
      this.router.navigate(['/login']);
      return;
    }
  
    // Validar el formulario
    if (this.crearForm.invalid) {
      Swal.fire('Error', 'Por favor complete el formulario correctamente.', 'error');
      return;
    }
  
    // Capturar los valores del formulario
    const destinoSeleccionado = this.crearForm.get('destino')?.value;
    if (!destinoSeleccionado || !destinoSeleccionado.id) {
      Swal.fire('Error', 'El ID del destino seleccionado no es válido o está vacío.', 'error');
      return;
    }
  
    // Construir el objeto de la experiencia
    const experiencia: Experiencia = {
      destinos: destinoSeleccionado, // Asegúrate de enviar el campo `destino` correctamente
      usuario: this.currentUser,
      calificacion: this.crearForm.value.calificacion,
      comentario: this.crearForm.value.comentario,
      fecha: new Date().toISOString(),
      id: 0,
    };
  
    // Enviar la experiencia al backend
    this.experienciaService.guardarExperiencia(experiencia).subscribe(
      response => {
        Swal.fire('Éxito', 'Experiencia guardada exitosamente.', 'success');
        this.limpiarFormulario();
      },
      error => {
        console.error('Error al guardar la experiencia:', error);
        Swal.fire('Error', error.error || 'Hubo un error al guardar la experiencia.', 'error');
      }
    );
  }
  

  limpiarFormulario() {
    this.crearForm.reset();
  }

  volver() {
    this.router.navigate(['/tu-inicio']);
  }
}


