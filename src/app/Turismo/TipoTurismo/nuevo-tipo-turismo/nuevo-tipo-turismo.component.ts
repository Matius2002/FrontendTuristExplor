import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TipoTurismoService} from "../tipo-turismo.service";
import Swal from "sweetalert2";
import {catchError, of} from "rxjs";
import {Router} from "@angular/router";

interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
@Component({
  providers: [TipoTurismoService, HttpClient],
  selector: 'app-nuevo-tipo-turismo',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  templateUrl: './nuevo-tipo-turismo.component.html',
  styleUrl: './nuevo-tipo-turismo.component.css'
})
export class NuevoTipoTurismoComponent implements OnInit{

  crearForm!: FormGroup;
  isSubmitting: boolean = false;
  tipoTurismos!: TipoTurismo;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoTipoTurismoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private tipoTurismoService: TipoTurismoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      popularidad: ['', [Validators.required]],

    });
  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.tipoTurismoService.verificarTipoExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'El Tipo de Turismo ya existe',
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
            title: 'Error al verificar El Tipo de Turismo',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: TipoTurismo): void {
    console.log('Datos del Tipo de Turismo:', tipoData);
    this.tipoTurismoService.guardarTipo(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Tipo de Turismo fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Tipo de Turismo'
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
    this.router.navigate(['/tipo-turismo']);
  }
}
