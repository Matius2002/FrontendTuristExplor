// Importaciones necesarias para el componente y su funcionamiento
import { Component, OnInit } from '@angular/core'; // Importa Component para definir el componente y OnInit para manejar la inicialización
import { HttpClient, HttpClientModule } from "@angular/common/http"; // Proporciona funcionalidad HTTP para interactuar con APIs
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"; // Maneja formularios reactivos y sus validaciones
import { NgClass, NgForOf, NgIf } from "@angular/common"; // Directivas de Angular para condicionales, bucles y manejo de clases CSS
import { ExperienciaService } from "../experiencia.service"; // Servicio personalizado para manejar la lógica de negocio de experiencias
import { Router } from "@angular/router"; // Permite la navegación entre rutas de la aplicación
import Swal from "sweetalert2"; // Librería para mostrar alertas y notificaciones
import { UsuarioService } from "../../../Admin/Usuarios/usuario.service"; // Servicio para manejar los usuarios

// Objeto Usuario que define la estructura esperada de un usuario
interface Usuario {
  id: number; // Identificador único del usuario
  nombreUsuario: string; // Nombre de usuario
  email: string; // Correo electrónico del usuario
}

// Objeto Destinos que define la estructura esperada de un destino
interface Destinos {
  id: number; // Identificador único del destino
  destinoName: string; // Nombre del destino
}

// Objeto Experiencia que define la estructura esperada de una experiencia
interface Experiencia {
  id: number; // Identificador único de la experiencia
  calificacion: string; // Calificación de la experiencia
  comentario: string; // Comentario del usuario sobre la experiencia
  fecha: string; // Fecha en la que se registra la experiencia
  usuario: Usuario; // Objeto usuario que contiene los datos del usuario asociado a la experiencia
  destinos: Destinos; // Objeto destinos que contiene los datos del destino asociado a la experiencia
}

// Decorador Component que define el comportamiento y metadatos del componente
@Component({
  providers: [ExperienciaService, HttpClient, UsuarioService], // Proveedores de servicios que estarán disponibles en este componente
  selector: 'app-nueva-experiencia', // Nombre del selector del componente para usarlo en otras plantillas
  standalone: true, // Indica que este componente es independiente y no depende de un módulo Angular tradicional
  imports: [ // Lista de módulos y directivas importadas que se utilizarán dentro del componente
    FormsModule, // Módulo para trabajar con formularios básicos
    NgIf, // Directiva para condicionales en el HTML
    ReactiveFormsModule, // Módulo para manejar formularios reactivos
    NgClass, // Directiva para manipulación dinámica de clases CSS
    NgForOf, // Directiva para iterar sobre listas en el HTML
    HttpClientModule // Módulo para realizar peticiones HTTP
  ],
  templateUrl: './nueva-experiencia.component.html', // Ruta al archivo de plantilla HTML del componente
  styleUrl: './nueva-experiencia.component.css' // Ruta al archivo de estilos CSS del componente
})

// Clase NuevaExperienciaComponent que define la lógica del componente
export class NuevaExperienciaComponent implements OnInit {
  crearForm!: FormGroup; // FormGroup para manejar el formulario reactivo
  experiencias!: Experiencia; // Objeto de tipo Experiencia para almacenar datos de la experiencia actual
  usuarios: Usuario[] = []; // Arreglo de usuarios disponibles
  destinos: Destinos[] = []; // Arreglo de destinos disponibles
  isSubmitting: boolean = false; // Indicador para manejar el estado de envío del formulario
  currentUser: Usuario | null = null; // Objeto para almacenar el usuario actual autenticado
  fecha: any; // Variable para manejar la fecha (a definir su uso)
  comentario: any; // Variable para manejar comentarios (a definir su uso)
  calificacion: any; // Variable para manejar calificaciones (a definir su uso)

  // Constructor del componente, inyectando los servicios y dependencias necesarias
  constructor(
    private formBuilder: FormBuilder, // Servicio para construir formularios
    private experienciaService: ExperienciaService, // Servicio para manejar las experiencias
    private router: Router, // Servicio de Angular para la navegación entre rutas
    private usuariosService: UsuarioService, // Servicio para manejar la lógica de usuarios
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Verificar si el usuario está autenticado al iniciar el componente
    this.currentUser = this.usuariosService.getCurrentUser(); // Obtiene el usuario actual autenticado
    if (!this.currentUser) { // Si no hay usuario autenticado
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para registrar una experiencia.', 'warning') // Muestra un mensaje de advertencia
        .then(() => {
        });
      return; // Detiene la ejecución del componente si no está autenticado
    }

    // Inicializa el formulario reactivo con sus campos y validaciones
    this.crearForm = this.formBuilder.group({
      comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]], // Campo para comentario con validaciones
      destinos: ['', Validators.required], // Campo para el destino requerido
      calificacion: ['', Validators.required] // Campo para la calificación requerida
    });
    this.cargarDestinos(); // Carga los destinos disponibles llamando a un método del servicio
  }

  // Método para cargar los destinos disponibles desde el servicio
  cargarDestinos(): void {
    this.experienciaService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) => { // Al recibir los destinos desde el backend
        this.destinos = destinos; // Asigna los destinos recibidos al arreglo local
      },
      (error) => { // Manejo de errores si ocurre un fallo en la solicitud
        console.error(error); // Imprime el error en consola
      }
    );
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    // Verificar si el usuario está autenticado
    if (!this.currentUser) { // Si no hay usuario autenticado
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para guardar una experiencia.', 'error'); // Muestra un mensaje de error
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
      return; // Detiene la ejecución del método
    }


    // Validar el formulario
    if (this.crearForm.invalid) { // Si el formulario es inválido
      Swal.fire('Error', 'Por favor complete el formulario correctamente.', 'error'); // Muestra un mensaje de error
      return; // Detiene la ejecución del método
    }

    // Capturar los valores del formulario
    const destinoSeleccionado = this.crearForm.get('destinos')?.value; // Obtiene el valor del campo de destino
    console.log('Destino seleccionado antes de enviar:', destinoSeleccionado);
    if (!destinoSeleccionado || !destinoSeleccionado.id) { // Verifica que el destino seleccionado tenga un ID válido
      Swal.fire('Error', 'El ID del destino seleccionado no es válido o está vacío.', 'error'); // Muestra un mensaje de error
      return; // Detiene la ejecución del método
    }

    // Construir el objeto de la experiencia
    const experiencia: Experiencia = {
      id: 0, // Se asigna 0, ya que se espera que el backend genere un ID único
      calificacion: this.crearForm.value.calificacion, // Asigna la calificación del formulario
      comentario: this.crearForm.value.comentario, // Asigna el comentario del formulario
      fecha: new Date().toISOString(), // Asigna la fecha actual en formato ISO
      usuario: this.currentUser, // Asigna el usuario autenticado */
      destinos: destinoSeleccionado, // Asigna el destino seleccionado
    };

    console.log('Datos que se enviarán: ', experiencia);

    // Enviar la experiencia al backend
    this.experienciaService.guardarExperiencia(experiencia).subscribe({
      next: (response) => {
        console.log('Experiencia guardada exitosamente', response);
        // Lógica en caso de éxito
      },
      error: (error) => {
        console.error('Error al guardar la experiencia:', error);
        console.error('Código de error:', error.status, 'Mensaje:', error.message);
      }
    });
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    this.crearForm.reset(); // Resetea los campos del formulario a su estado inicial
  }

  // Método para navegar a la ruta inicial
  volver() {
    this.router.navigate(['/tu-inicio']); // Navega a la página de inicio
  }
}