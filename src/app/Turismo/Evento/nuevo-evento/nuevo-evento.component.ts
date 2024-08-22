import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {EventoService} from "../evento.service";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";

interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
interface Destinos {
  id: number;
  destinoName: string;
}

interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

interface Evento {
  id: number;
  destinos: Destinos[];
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
  tipoTurismo: TipoTurismo;
}
@Component({
  providers: [EventoService,HttpClient],
  selector: 'app-nuevo-evento',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './nuevo-evento.component.html',
  styleUrl: './nuevo-evento.component.css'
})
export class NuevoEventoComponent implements OnInit{
  crearForm!: FormGroup;
  eventos!: Evento;
  tipoTurismos: TipoTurismo[] = [];
  destinos: Destinos[] = [];
  imagenes: Images[] = [];
  isSubmitting: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoEventoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
      private eventoService: EventoService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      ubicacion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      costoEntrada: ['', [Validators.required]],
      images: [[], [Validators.required]],
      destinos: [[], [Validators.required]],
      tipoTurismo: [[], [Validators.required]],
    });
    this.cargarImages();
    this.cargarDestinos();
    this.cargarTipoTurismo();
  }
  cargarImages(): void{
    this.eventoService.recuperarImages().subscribe(
      (imagenes: Images[]) =>{
        this.imagenes = imagenes;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  cargarDestinos(): void {
    this.eventoService.recuperarDestinos().subscribe(
      (destinos: Destinos[]) => {
        this.destinos = destinos;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  cargarTipoTurismo(): void {
    this.eventoService.recuperarTipoTurismo().subscribe(
      (tipo: TipoTurismo[]) => {
        this.tipoTurismos = tipo;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.eventoService.verificarEventoExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'El Evento ya existe',
              text: 'Ingrese un nombre diferente'
            });
          } else {
            const formData = this.crearForm.value;
            console.log('Datos del evento antes de guardar:', formData);
            this.guardarTipo(formData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar El Evento',
            text: error.message
          });
          this.isSubmitting = false; // Detener la animación de carga en caso de error
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

  guardarTipo(tipoData: Evento): void {
    console.log('Datos del Evento:', tipoData);
    // Asegúrate que tipoData.destinos sea un array de objetos { id: number, destinoName: string }
    this.eventoService.guardarEvento(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Evento fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
      this.isSubmitting = false; // Detener la animación de carga después de guardar
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Evento'
      });
      this.isSubmitting = false; // Detener la animación de carga en caso de error
    });
  }


  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/eventos']);
  }
  agregarNuevaImagen() {
    this.router.navigate(['/nueva-imagen']);
  }
}
