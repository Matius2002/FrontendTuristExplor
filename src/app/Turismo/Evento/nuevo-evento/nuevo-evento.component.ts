import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {EventoService} from "../evento.service";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";

interface Destinos{
  id: number;
  destinoName: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Evento{
  id: number;
  destino: Destinos;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
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
  destinos: Destinos [] = [];
  imagenes: Images []=[];
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
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      costoEntrada: ['', [Validators.required]],
      imagenes: ['', [Validators.required]],
      destinos: ['', [Validators.required]],

    });
    //this.cargarImages();
    //this.cargarDestinos();
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
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: Evento): void {
    console.log('Datos del Evento:', tipoData);
    this.eventoService.guardarEvento(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Evento fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Evento'
      });
    });

  }

  /*
    onCancelar(): void {
      this.dialogRef.close();
    }

   */

  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/eventos']);
  }

}
