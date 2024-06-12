import {Component, Inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DestinoService} from "../destino.service";
import Swal from 'sweetalert2';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {catchError, of} from "rxjs";
import {Router} from "@angular/router";
interface TipoTurismo{
  id: number;
  nombre: string;
}
interface AtracionesPrincipales{
  id: number;
  nombre: string;
}
interface EpocasVisitar{
  id: number;
  nombre: string;
}
interface Images{
  id: number;
  ruta: string;
}
interface Destinos {
  id: number;
  destinoName: string;
  descripcion: string;
  ubicacion: string;
  tipoTurismo: TipoTurismo[];
  atracionesPrincipales: AtracionesPrincipales [];
  epocasVisitar: EpocasVisitar [];
  imagenes: Images [];
  fechaCreacion: Date;
  horaCreacion: string;
  fechaActualizacion: Date;
  horaActualizacion: string;
}
@Component({
  providers: [DestinoService,HttpClient],
  selector: 'app-nuevo-destino',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgForOf,
  ],
  templateUrl: './nuevo-destino.component.html',
  styleUrl: './nuevo-destino.component.css'
})
export class NuevoDestinoComponent implements OnInit{
  crearForm!: FormGroup;
  destinos!: Destinos;
  tipoTurismos: TipoTurismo []=[];
  atracionesPrincipales: AtracionesPrincipales [] = [];
  imagenes: Images []=[];
  epocasVisitar: EpocasVisitar [] = [];
  isSubmitting: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoDestinoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private destinoService: DestinoService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      destinoName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      ubicacion: ['', [Validators.required]],
      tipoTurismo: [[], [Validators.required]],
      atracionesPrincipales: [[], [Validators.required]],
      epocasVisitar: [[], [Validators.required]],
      imagenes: [[], [Validators.required]],
      fechaCreacion: ['', [Validators.required]],
      horaCreacion: ['', [Validators.required]],
      fechaActualizacion: ['', [Validators.required]],
      horaActualizacion: ['', [Validators.required]],
    });
    this.cargarAtracionesPrincipales();
    this.cargarImages();
    this.cargarEpocasVisitar();
    this.cargarTipoTurismo();
  }
  cargarAtracionesPrincipales(): void{
    this.destinoService.recuperarAtracionesPrincipales().subscribe(
      (atracionesPrincipales: AtracionesPrincipales[]) =>{
        this.atracionesPrincipales = atracionesPrincipales;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  cargarTipoTurismo(): void{
    this.destinoService.recuperarTodosTiposTurismo().subscribe(
      (tipoTurismos: TipoTurismo[]) =>{
        this.tipoTurismos = tipoTurismos;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  cargarImages(): void{
    this.destinoService.recuperarImages().subscribe(
      (imagenes: Images[]) =>{
        this.imagenes = imagenes;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  cargarEpocasVisitar(): void{
    this.destinoService.recuperarEpocasVisitar().subscribe(
      (epocasVisitar: EpocasVisitar[]) =>{
        this.epocasVisitar = epocasVisitar;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const destinoName = this.crearForm.get('destinoName')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.destinoService.verificarDestinosExistente(destinoName).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'EL Destino ya existe',
              text: 'Ingrese un nombre diferente'
            });
          } else {
            const formData = this.crearForm.value;
            this.guardarDestinos(formData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar el Destino',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarDestinos(destinosData: Destinos): void {
    console.log('Datos del Destino:', destinosData);
    this.destinoService.guardarDestinos(destinosData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Destino creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el Destino'
      });
    });
  }
  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/destinos']);
  }
}
