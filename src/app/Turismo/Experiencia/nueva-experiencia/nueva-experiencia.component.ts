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
    //public dialogRef: MatDialogRef<NuevaExperienciaComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private experienciaService: ExperienciaService,
    private router: Router,
    private usuariosService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      comentario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      fecha: ['', [Validators.required]],
      //usuarios: ['', [Validators.required]],
      destinos: ['', [Validators.required]],
      calificacion: ['', Validators.required]
    });
    this.currentUser = this.usuariosService.getCurrentUser(); // Obtener el usuario actual del servicio de autenticación

    //this.usuarios();
    //this.destinos();

  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      this.isSubmitting = true;
      const formData = this.crearForm.value;
      if (!this.currentUser) {
        formData.usuario = this.currentUser;// Agregar el usuario actual a los datos del formulario
        this.guardarExperiencia(formData);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Usuario no autenticado',
          text: 'Por favor, inicie sesión'
        });
      }
      this.isSubmitting = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos'
      });
    }
  }
    guardarExperiencia(experienciaData: Experiencia): void {
      console.log('Datos de la experiencia:', experienciaData);
      this.experienciaService.guardarExperiencia(experienciaData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'La Experiencia fue creada correctamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.crearForm.reset();
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al guardar La Experiencia'
        });
      });
  }

  limpiarFormulario() {
    this.crearForm.reset();

  }

  /*
    onCancelar(): void {
      this.dialogRef.close();
    }

   */

  volver() {
    this.router.navigate(['/tu-inicio']);
  }
}

