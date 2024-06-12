import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AtracionesService} from "../atraciones.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";

interface Atraciones{
  id: number;
  nombre: string;
  descripcion: string;
  horarioFuncionamiento: string;
  horarioFin: string;
}
@Component({
  providers: [AtracionesService, HttpClient],
  selector: 'app-nueva-atraciones',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './nueva-atraciones.component.html',
  styleUrl: './nueva-atraciones.component.css'
})
export class NuevaAtracionesComponent  implements OnInit{
  crearForm!: FormGroup;
  atraciones!: Atraciones;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevaAtracionesComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private atracionesService: AtracionesService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      horarioFuncionamiento: ['', [Validators.required]],
      horarioFin: ['', [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.atracionesService.verificarAtracionesExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'La Atracción ya existe',
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
            title: 'Error al verificar La Atracción',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: Atraciones): void {
    console.log('Datos de La Atracción:', tipoData);
    this.atracionesService.guardarAtraciones(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'La Atracción fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar La Atracción'
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
    this.router.navigate(['/atraciones-principales']);
  }

}
