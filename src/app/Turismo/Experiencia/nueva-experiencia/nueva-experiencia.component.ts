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
    // Verificación del usuario autenticado
    if (!this.currentUser) {
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para guardar una experiencia.', 'error');
      this.isSubmitting = false;
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si no está autenticado
      return;
    }
  
    this.isSubmitting = true;
  
    // Verificación del formulario
    if (this.crearForm.invalid) {
      Swal.fire('Error', 'Por favor complete el formulario correctamente.', 'error');
      this.isSubmitting = false;
      return;
    }
  
    // Captura y convierte correctamente el ID del destino
    const destinoIdSeleccionado = parseInt(this.crearForm.value.destinos, 10);
    console.log('ID seleccionado:', destinoIdSeleccionado); // Debugging
  
    // Verifica si el ID es válido
    if (isNaN(destinoIdSeleccionado)) {
      Swal.fire('Error', 'El ID del destino seleccionado no es válido.', 'error');
      this.isSubmitting = false;
      return;
    }
  
    // Busca el destino usando el ID seleccionado para asegurarse de que es válido
    const destinoSeleccionado = this.destinos.find(d => d.id === destinoIdSeleccionado);
    console.log('Destino encontrado:', destinoSeleccionado); // Debugging
  
    // Verifica que el destino encontrado no sea undefined
    if (!destinoSeleccionado) {
      Swal.fire('Error', 'Destino seleccionado no es válido.', 'error');
      this.isSubmitting = false;
      return;
    }
  
    // Construcción del objeto de experiencia
    const experiencias: Experiencia = {
      destinos: destinoSeleccionado, // Debe ser un objeto válido
      usuario: this.currentUser,     // Debe estar autenticado
      calificacion: this.crearForm.value.calificacion, // Debe tener un valor
      comentario: this.crearForm.value.comentario,     // Debe tener un valor
      fecha: new Date().toISOString(),                 // Fecha en formato ISO
      id: 0                                            // Asegúrate de que el ID sea correcto
    };
  
    console.log('Datos enviados:', experiencias);
  
    // Envío de la experiencia al backend
    this.experienciaService.guardarExperiencia(experiencias).subscribe(
      response => {
        console.log('Experiencia guardada exitosamente', response);
        Swal.fire('Éxito', 'Experiencia guardada exitosamente.', 'success');
        this.limpiarFormulario();
        this.isSubmitting = false;
      },
      error => {
        console.error('Error al guardar la experiencia:', error);
        if (error.error && error.error.message) {
          Swal.fire('Error', `Error del servidor: ${error.error.message}`, 'error');
        } else {
          Swal.fire('Error', 'Hubo un error al guardar la experiencia.', 'error');
        }
        this.isSubmitting = false;
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


