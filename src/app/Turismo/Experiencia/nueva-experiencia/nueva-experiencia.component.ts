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

  cargarDestinos(): void{
    this.experienciaService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) =>{
        this.destinos = destinos;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.crearForm.invalid) {
      Swal.fire('Error', 'Por favor complete el formulario correctamente.', 'error');
      return;
    }
  
    if (!this.currentUser) {
      Swal.fire('Usuario no autenticado', 'Debe iniciar sesión para guardar una experiencia.', 'error');
      return;
    }
  
    const nuevaExperiencia: Experiencia = {
      id: 0,
      comentario: this.crearForm.value.comentario,
      calificacion: this.crearForm.value.calificacion,
      fecha: new Date().toISOString(),
      usuario: this.currentUser!,
      destinos: this.crearForm.value.destinos
    };
  
    this.isSubmitting = true;
    this.experienciaService.guardarExperiencia(nuevaExperiencia).subscribe(
      () => {
        Swal.fire('Experiencia guardada', 'Su experiencia ha sido guardada exitosamente', 'success');
        this.router.navigate(['/nueva-experiencia']);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'Ocurrió un error al guardar la experiencia', 'error');
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

