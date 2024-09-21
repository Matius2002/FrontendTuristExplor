import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ExperienciaService} from "../experiencia.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {UsuarioService} from "../../../Admin/Usuarios/usuario.service";
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
  providers: [ExperienciaService,HttpClient, UsuarioService],
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
export class NuevaExperienciaComponent implements OnInit{
  crearForm!: FormGroup;
  experiencias!: Experiencia;
  usuarios: Usuario [] = [];
  destinos: Destinos [] = [];
  isSubmitting: boolean = false;
  currentUser: Usuario | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private experienciaService: ExperienciaService,
    private router: Router,
    private usuariosService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      comentario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      destinos: ['', [Validators.required]],
      calificacion: ['', Validators.required]
    });
    this.currentUser = this.usuariosService.getCurrentUser();

    this.cargarDestinos();

  }

  cargarDestinos(): void {
    this.experienciaService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) => {
        console.log('Destinos cargados:', destinos); // Verifica si los datos llegan correctamente
        this.destinos = destinos;
      },
      (error: any) => {
        console.error('Error al cargar destinos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.crearForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Complete todos los campos correctamente.',
      });
      return;
    }

    const experiencia = this.crearForm.value;

    // Asigna correctamente el destinoId
    experiencia.destinoId = experiencia.destinos.id;

    // Elimina el campo destinos antes de enviar al backend
    delete experiencia.destinos;

    this.experienciaService.guardarExperiencia(experiencia).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Experiencia guardada con éxito',
        }).then(() => {
          // Resetea el formulario para agregar un nuevo comentario
          this.crearForm.reset();
        });
      },
      error => {
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'No estás autenticado',
            text: 'Por favor, inicia sesión nuevamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar la experiencia.',
          });
        }
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