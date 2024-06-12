import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
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
interface Alojamiento{
  id: number;
  descripcion: string;
  destinos: Destinos;
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  direccion: string;
  celular: string;
  email: string;
  webUrl: string;
  precioGeneral: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;

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
      destinos: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required]],
      webUrl: ['', [Validators.required]],
      precioGeneral: ['', [Validators.required]],
      fechaCreacion: ['', [Validators.required]],
      fechaActualizacion: ['', [Validators.required]],
    });
    this.cargarTiposAlojamientos();
    this.cargarDestinos();
  }
  cargarTiposAlojamientos(): void{
    this.alojamientoService.recuperarTodosTiposAlojamiento().subscribe(
      (tipos: TipoAlojamiento[]) =>{
        this.tipoAlojamientos = tipos;
      },
      (error) => {
        console.error(error);
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
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
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
            const formData = this.crearForm.value;
            this.guardarTipo(formData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar El Alojamiento',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: Alojamiento): void {
    console.log('Datos del Alojamiento:', tipoData);
    this.alojamientoService.guardarAlojamiento(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Alojamiento fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Alojamiento'
      });
    });
  }
  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/alojamientos']);
  }
}
