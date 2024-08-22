import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NoticiaService} from "../noticia.service";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
interface TipoTurismo {
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  fuente: string;
  images: Images[];
  tipoTurismo: TipoTurismo;
}
@Component({
  providers: [NoticiaService, HttpClient],
  selector: 'app-nueva-noticia',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './nueva-noticia.component.html',
  styleUrl: './nueva-noticia.component.css'
})
export class NuevaNoticiaComponent implements OnInit {

  crearForm!: FormGroup;
  noticias!: Noticia;
  imagenes: Images []=[];
  tipoTurismo: TipoTurismo []=[];
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevaNoticiaComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private noticiaService: NoticiaService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      fechaPublicacion: ['', [Validators.required]],
      fuente: ['', [Validators.required]],
      imagenes: [[], [Validators.required]],
      tipoTurismos: ['', [Validators.required]],

    });
    this.cargarImages();
    this.cargarTipos();
  }
  cargarImages(): void {
    this.noticiaService.recuperarTodosImages().subscribe(
      (imagenes: Images[]) => {
        this.imagenes = imagenes;
        console.log('Imágenes cargadas:', this.imagenes);
      },
      (error) => {
        console.error('Error al cargar imágenes:', error);
      }
    );
  }

  cargarTipos(): void{
    this.noticiaService.recuperarTodosTipos().subscribe(
      (tiposTurismo: TipoTurismo[]) =>{
        this.tipoTurismo = tiposTurismo;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const titulo = this.crearForm.get('titulo')?.value;
      const contenido = this.crearForm.get('contenido')?.value;
      const fechaPublicacion = this.crearForm.get('fechaPublicacion')?.value;
      const fuente = this.crearForm.get('fuente')?.value;
      const imagenes = this.crearForm.get('imagenes')?.value;
      const tipoTurismo = this.crearForm.get('tipoTurismos')?.value;

      console.log('Datos a enviar al backend:');
      console.log('titulo:', titulo);
      console.log('contenido:', contenido);
      console.log('fechaPublicacion:', fechaPublicacion);
      console.log('fuente:', fuente);
      console.log('imagenes:', imagenes);
      console.log('tipoTurismo:', tipoTurismo);

      const noticiaData: Noticia = {
        id: 0,
        titulo: titulo,
        contenido: contenido,
        fechaPublicacion: fechaPublicacion,
        fuente: fuente,
        images: imagenes,
        tipoTurismo: tipoTurismo
      };

      console.log('Datos a enviar al servicio:', noticiaData);

      this.isSubmitting = true;
      this.noticiaService.verificarNoticiaExistente(titulo).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'La Noticia ya existe',
              text: 'Ingrese un nombre diferente'
            });
          } else {
            this.guardarTipo(noticiaData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar La Noticia',
            text: error.message
          });
          this.isSubmitting = false;
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos'
      });
    }
  }
  guardarTipo(noticiaData: Noticia): void {
    console.log('Enviando datos al servicio:', noticiaData);

    this.noticiaService.guardarNoticia(noticiaData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        Swal.fire({
          icon: 'success',
          title: 'La Noticia fue creada correctamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.crearForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar la noticia:', error);
        this.isSubmitting = false;

        let errorMsg = 'Ocurrió un error al crear la Noticia';
        console.log('Error status:', error.status);
        console.log('Error message:', error.message);
        console.log('Error details:', error);

        if (error.status === 400) {
          errorMsg = error.error ? error.error : 'Error de validación en el servidor';
        } else if (error.status === 0) {
          errorMsg = 'Error de red: no se puede conectar al servidor';
        } else if (error.status === 500) {
          errorMsg = 'Error interno del servidor: por favor, inténtelo de nuevo más tarde';
        } else if (error.status === 401) {
          errorMsg = 'Error de autenticación: no autorizado para realizar esta acción';
        } else if (error.status === 403) {
          errorMsg = 'Error de autorización: no tiene permisos para realizar esta acción';
        } else if (error.status === 408) {
          errorMsg = 'Error de tiempo de espera: la solicitud ha tardado demasiado en procesarse';
        } else if (error.status === 422) {
          errorMsg = 'Error de validación: los datos proporcionados no son válidos';
        } else {
          errorMsg = 'Error al crear la Noticia';
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg
        });
      }
    });
  }

  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/noticias']);
  }
  agregarImagen() {
    this.router.navigate(['/nueva-imagen']);
  }

  agregarNuevaImagen() {
    this.router.navigate(['/nueva-imagen']);
  }
}
