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

  //Inicio del método onSubmit
  onSubmit() {
    if (this.crearForm.invalid) {
      Swal.fire({
        icon: 'error', 
        title: '¡Error!',
        text: 'Complete todos los campos correctamente.',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,}); 
        return;
    }

    //Constante para obtener valores
    const credentials = {
      email: this.crearForm.value.email,
      password: this.crearForm.value.password
    };

    //Proceso de autenticación al iniciar sesión
    this.usuarioService.login(credentials).subscribe(response => {
        this.usuarioService.guardarUsuarioEnStorage(response.token); 
        this.usuarioService.guardarToken(response.token);
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión',
          timer: 10000,
          timerProgressBar: true,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // Si el usuario presiona "Cancelar", no hacemos nada (se queda en la página actual)
          } else {
            // Si no cancela, se redirige a la página indicada
            this.router.navigate(['/tu-inicio']);
          }
        }); //Fin de alerta                     
      });
  }
  //Fin del método onSubmit

  limpiarFormulario() {
    this.crearForm.reset();
  }

  volver() {
    this.router.navigate(['/tu-inicio']);
  }

  goToRegister() {
    this.router.navigate(['/nuevo-usuario']);
  }

  goToForgetPassword() {
  }
}