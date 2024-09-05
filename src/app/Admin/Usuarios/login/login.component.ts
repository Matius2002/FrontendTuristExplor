import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../usuario.service"; // Servicio para manejar las operaciones de usuario, como el inicio de sesión
import { HttpClient, HttpClientModule } from "@angular/common/http"; // Módulos HTTP para realizar solicitudes al backend
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"; // Módulos y servicios para la gestión de formularios reactivos
import { NgForOf, NgIf } from "@angular/common"; // Directivas de Angular para bucles y condiciones
import { Router } from "@angular/router"; // Servicio para la navegación entre rutas
import Swal from "sweetalert2"; // Librería para mostrar alertas estilizadas

// Interfaces para definir la estructura de roles y usuarios
interface Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}

interface Usuarios {
  id: number;
  nombreUsuario: string;
  email: string;
  password: string;
  fechaRegistro: Date;
  rol: Rol;
}

@Component({
  providers: [UsuarioService, HttpClient], // Proveedores del servicio de usuario y HTTP
  selector: 'app-login', // Selector del componente
  standalone: true, // Define el componente como independiente (standalone)
  imports: [
    FormsModule, // Módulo para formularios
    NgIf, // Directiva para condiciones
    ReactiveFormsModule, // Módulo para formularios reactivos
    HttpClientModule, // Módulo para manejar solicitudes HTTP
    NgForOf, // Directiva para bucles
  ],
  templateUrl: './login.component.html', // Ruta del archivo de la plantilla HTML del componente
  styleUrl: './login.component.css' // Ruta del archivo de estilos CSS del componente
})
export class LoginComponent implements OnInit {

  //Variables
  crearForm!: FormGroup; // Declaración del grupo de formularios para manejar los controles del formulario de inicio de sesión
  usuarios!: Usuarios; // Variable para almacenar la información del usuario

  constructor(
    private formBuilder: FormBuilder, // Constructor de formularios reactivos
    private usuarioService: UsuarioService, // Servicio de usuario para manejar las operaciones relacionadas con el usuario
    private router: Router, // Servicio de navegación para redirigir al usuario entre rutas
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Inicialización del formulario de inicio de sesión con validaciones
    this.crearForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email con validaciones de requerido y formato de correo electrónico
      password: ['', [Validators.required, Validators.minLength(1)]] // Campo de contraseña con validación de requerido y longitud mínima
    });
  }

  // Método que se ejecuta cuando se envía el formulario
  onSubmit() {
    // Verifica si el formulario es inválido, mostrando un mensaje de error si es el caso
    if (this.crearForm.invalid) {
      Swal.fire({icon: 'error', title: 'Formulario inválido',text: 'Complete todos los campos correctamente.'});
      return; // Detiene la ejecución si el formulario no es válido
    }

    // Crea un objeto con las credenciales a partir de los valores del formulario
    const credentials = {
      email: this.crearForm.value.email,
      password: this.crearForm.value.password
    };

    //Proceso de autenticación al inicial sesión
    this.usuarioService.login(credentials).subscribe( //El método login() del usuarioService envía las credenciales del usuario (correo y contraseña) al backend.
      response => {
        console.log(response); //Muestra el token
        this.usuarioService.guardarUsuarioEnStorage(response.token); //Guarda el token en localStorage
        this.usuarioService.guardarToken(response.token);
        Swal.fire({ icon: 'success', title: 'Inicio de sesión exitoso', text: '¡Bienvenido de nuevo! Serás redirigido en un momento.', timer: 3000, timerProgressBar: true, showConfirmButton: false, position: 'center', willClose: () => {
          this.router.navigate(['/tu-inicio']);
        }});
      });
  }

  // Método para limpiar el formulario de inicio de sesión
  limpiarFormulario() {
    this.crearForm.reset();
  }

  // Método para redirigir al usuario a la página de inicio
  volver() {
    this.router.navigate(['/tu-inicio']);
  }

  // Método para redirigir al usuario a la página de registro de un nuevo usuario
  goToRegister() {
    this.router.navigate(['/nuevo-usuario']);
  }

  // Método para redirigir al usuario a la página de recuperación de contraseña (pendiente de implementación)
  goToForgetPassword() {
  }
}