import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TipoAlojamientoService} from "../tipo-alojamiento.service";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
interface TipoAlojamiento{
  id: number;
  nombre: string;
  descripcion: string;
  servicios: string;
  precioPromedio: string;
}
@Component({
  providers: [TipoAlojamientoService, HttpClient],
  selector: 'app-nuevo-tipo-alojamiento',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './nuevo-tipo-alojamiento.component.html',
  styleUrl: './nuevo-tipo-alojamiento.component.css'
})
export class NuevoTipoAlojamientoComponent implements OnInit{
  crearForm!: FormGroup;
  tipoAlojamiento!: TipoAlojamiento;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoTipoAlojamientoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private tipoAlojamientoService: TipoAlojamientoService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      servicios: ['', [Validators.required]],
      precioPromedio: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.tipoAlojamientoService.verificarTipoExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'El Tipo de Alojamiento ya existe',
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
            title: 'Error al verificar El Tipo de Alojamiento',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: TipoAlojamiento): void {
    console.log('Datos del Tipo de Turismo:', tipoData);
    this.tipoAlojamientoService.guardarTipoAlojamiento(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Tipo de Alojamiento fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Tipo de Alojamiento'
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
    this.router.navigate(['/tipo-alojamiento']);
  }
}
