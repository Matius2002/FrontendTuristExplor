import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../usuario.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

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
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgForOf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  crearForm!: FormGroup;
  usuarios!: Usuarios;
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    if (this.crearForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Complete todos los campos correctamente.',
      });
      return;
    }

    const credentials = {
      email: this.crearForm.value.email,
      password: this.crearForm.value.password
    };

    this.usuarioService.login(credentials).subscribe(
      response => {
        console.log(response);
          this.usuarioService.guardarUsuarioEnStorage(response.token);
          this.usuarioService.guardarToken(response.token);
        Swal.fire({icon: 'success',title: 'Inicio de sesión exitoso',}).then(() => {
          this.router.navigate(['/tu-inicio']);
        });
      }
    );
  }

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
