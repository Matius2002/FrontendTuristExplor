import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {AlojamientoService} from "../alojamiento.service";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";
interface Destinos {
  id: number;
  destinoName: string;
}
interface  TipoAlojamiento{
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Alojamiento{
  id: number;
  descripcion: string;
  destinos: Destinos [];
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  direccion: string;
  celular: string;
  email: string;
  webUrl: string;
  precioGeneral: number;
  fechaCreacion: Date;
  imagenes: Images[];
}
@Component({
  providers: [AlojamientoService, HttpClient],
  selector: 'app-nuevo-alojamiento',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,

  ],
  templateUrl: './nuevo-alojamiento.component.html',
  styleUrl: './nuevo-alojamiento.component.css'
})
export class NuevoAlojamientoComponent implements OnInit{
  isSubmitting: boolean = false;
  crearForm!: FormGroup;
  alojamientos!: Alojamiento;
  tipoAlojamientos: TipoAlojamiento []=[];
  destinos: Destinos[] = [];
  imagenes: Images []=[];

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoAlojamientoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private alojamientoService: AlojamientoService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      tipoAlojamiento: ['', [Validators.required]],
      destinos: [[], [Validators.required]],
      direccion: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required]],
      webUrl: ['', [Validators.required]],
      precioGeneral: ['', [Validators.required]],
      fechaCreacion: ['', [Validators.required]],
      imagenes: [[], [Validators.required]],
    });
    this.cargarTiposAlojamientos();
    this.cargarDestinos();
    this.cargarImages();
  }

  cargarImages(): void {
    this.alojamientoService.recuperarTodosImages().subscribe(
      (imagenes: Images[]) => {
        this.imagenes = imagenes;
        console.log('Imágenes cargadas:', this.imagenes);
      },
      (error) => {
        console.error('Error al cargar imágenes:', error);
      }
    );
  }

  cargarTiposAlojamientos(): void{
    this.alojamientoService.recuperarTodosTiposAlojamiento().subscribe(
      (tipos: TipoAlojamiento[]) =>{
        this.tipoAlojamientos = tipos;
      },
      (error) => {
        console.error('error al cargar el tipo de alojamiento',error);
      }
    );
  }
  cargarDestinos(): void{
    this.alojamientoService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) =>{
        this.destinos = destinos;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')?.value;
      const descripcion = this.crearForm.get('descripcion')?.value;
      const direccion = this.crearForm.get('direccion')?.value;
      const celular = this.crearForm.get('celular')?.value;
      const email = this.crearForm.get('email')?.value;
      const webUrl = this.crearForm.get('webUrl')?.value;
      const precioGeneral = this.crearForm.get('precioGeneral')?.value;
      const fechaCreacion = this.crearForm.get('fechaCreacion')?.value;
      const destinos = this.crearForm.get('destinos')?.value; // Si tienes un control para destinos
      const tipoAlojamiento = this.crearForm.get('tipoAlojamiento')?.value; // Si tienes un control para tipoAlojamiento
      const images = this.crearForm.get('imagenes')?.value;

      console.log('Datos a enviar al backend:');
      console.log('nombre:', nombre);
      console.log('descripcion:', descripcion);
      console.log('direccion:', direccion);
      console.log('celular:', celular);
      console.log('email:', email);
      console.log('webUrl:', webUrl);
      console.log('precioGeneral:', precioGeneral);
      console.log('fechaCreacion:', fechaCreacion);
      console.log('destinos:', destinos);
      console.log('tipoAlojamiento:', tipoAlojamiento);
      console.log('imagenes:', images);

      const alojamientoData: Alojamiento = {
        id: 0,
        nombre: nombre,
        descripcion: descripcion,
        direccion: direccion,
        celular: celular,
        email: email,
        webUrl: webUrl,
        precioGeneral: precioGeneral,
        fechaCreacion: fechaCreacion,
        destinos: destinos,
        tipoAlojamiento: tipoAlojamiento,
        imagenes: images,
      };

      console.log('Datos a enviar al servicio:', alojamientoData);

      this.isSubmitting = true;
      this.alojamientoService.verificarAlojamientoExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'El Alojamiento ya existe',
              text: 'Ingrese un nombre diferente'
            });
          } else {
            this.guardarAlojamiento(alojamientoData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar el Alojamiento',
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

  guardarAlojamiento(alojamientoData: Alojamiento): void {
    console.log('Enviando datos al servicio:', alojamientoData);

    this.alojamientoService.guardarAlojamiento(alojamientoData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        Swal.fire({
          icon: 'success',
          title: 'El Alojamiento fue creado correctamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.crearForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar el alojamiento:', error);
        this.isSubmitting = false;

        let errorMsg = 'Ocurrió un error al crear el Alojamiento';
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
          errorMsg = 'Error al crear el Alojamiento';
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
    this.router.navigate(['/alojamientos']);
  }

  agregarNuevaImagen() {
    this.router.navigate(['/nueva-imagen']);
  }
}
