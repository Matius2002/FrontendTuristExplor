import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../usuario.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, of } from "rxjs";
import Swal from "sweetalert2";
import { NgForOf, NgIf } from "@angular/common";

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
  providers: [UsuarioService, HttpClient],
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgForOf,

  ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  crearForm!: FormGroup;
  usuarios!: Usuarios;
  roles: Rol[] = [];
  isSubmitting: boolean = false;


  hasLetters = false;
  hasNumbers = false;
  hasSymbols = false;
  tooShort = false;

  codigoConfirmacion?: string;
  codigoIncorrecto: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(250)]],
      password: ['', [Validators.required]],
      passwordConfirmar: ['', [Validators.required]],
      fechaRegistro: [new Date()],
      rol: ['', [Validators.required]],
      codigoConfirmacion: ['', Validators.required]
    });

    // Observar cambios en el campo de contraseña para actualizar las validaciones
    this.crearForm.get('password')?.valueChanges.subscribe(value => {
      this.validatePassword(value);
    });
    // Observar cambios en el campo de rol para mostrar o cerrar el campo de confirmación
    this.crearForm.get('rol')?.valueChanges.subscribe(() => {
      this.onRolChange();

    });
    this.cargarRoles();
  }

  // Función para validar la contraseña
  validatePassword(value: string) {
    if (value !== null) {
      this.hasLetters = /[a-zA-Z]/.test(value);
      this.hasNumbers = /\d/.test(value);
      this.hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      this.tooShort = value.length < 10;

      if (this.tooShort || !this.hasLetters || !this.hasNumbers || !this.hasSymbols) {
        this.crearForm.get('password')?.setErrors({ invalidPassword: true });
      } else {
        this.crearForm.get('password')?.setErrors(null);
      }
    }
  }

  cargarRoles(): void{
    // Llamar a tu servicio para obtener todos los roles
    this.usuarioService.recuperarTodosRoles().subscribe(
      (roles: Rol[]) => {
        this.roles = roles;
      },
      (error) => {
        console.error(error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    );
  }

  onSubmit() {
    if (this.crearForm.valid) {
      const nombreUsuario = this.crearForm.get('nombreUsuario')!.value;
      const email = this.crearForm.get('email')!.value;
      this.isSubmitting = true;

      this.usuarioService.verificarUsuarioExistente(nombreUsuario).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe((isExistenteNombre) => {
        if (isExistenteNombre) {
          Swal.fire({
            icon: 'error',
            title: 'El Usuario ya existe',
            text: 'Ingrese un nombre diferente'
          });
          this.isSubmitting = false;
        } else {
          this.usuarioService.verificarUsuarioPorEmail(email).pipe(
            catchError((error) => {
              console.error(error);
              return of(false);
            })
          ).subscribe((isExistenteEmail) => {
            if (isExistenteEmail) {
              Swal.fire({
                icon: 'error',
                title: 'El Email ya existe',
                text: 'Ingrese un email diferente'
              });
              this.isSubmitting = false;
            } else {
              // Validar el código de confirmación para el rol de Administrador
              if (this.crearForm.get('rol')?.value?.rolName === 'Administrador' && this.crearForm.get('codigoConfirmacion')?.value !== '2024') {
                this.codigoIncorrecto = true;
                this.isSubmitting = false;
              } else {
                const formData = this.crearForm.value;
                this.guardarUsuario(formData);
              }
            }
          });
        }
      });
    } else {
      // Manejar el caso en que el formulario no sea válido
    }
  }
  guardarUsuario(usuarioData: Usuarios): void {
    this.usuarioService.guardarUsuario(usuarioData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Usuario fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      }).then(() => {
        this.crearForm.reset();
        this.isSubmitting = false;
        // Redirigir al login
        this.router.navigate(['/login']);
      });
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el Usuario'
      });
      this.isSubmitting = false;
    });
  }

  limpiarFormulario() {
    this.crearForm.reset();
  }

  volver() {
    this.router.navigate(['/tu-inicio']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Método para manejar el cambio de rol
  onRolChange() {
    this.codigoIncorrecto = false;
  }
}
