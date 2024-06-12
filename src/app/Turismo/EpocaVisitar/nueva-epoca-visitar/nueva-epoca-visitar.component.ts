import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {EpocaVisitarService} from "../epoca-visitar.service";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
interface EpocaVisitar{
  id: number;
  nombre: string;
  descripcion: string;
  clima: string;
}
@Component({
  providers: [EpocaVisitarService,HttpClient],
  selector: 'app-nueva-epoca-visitar',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './nueva-epoca-visitar.component.html',
  styleUrl: './nueva-epoca-visitar.component.css'
})
export class NuevaEpocaVisitarComponent implements OnInit{
  crearForm!: FormGroup;
  epocaVisitar!: EpocaVisitar;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevaEpocaVisitarComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private epocaVisitarService: EpocaVisitarService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      clima: ['', [Validators.required]],
  });

  }
  onSubmit(): void {
    if (this.crearForm.valid) {
      const nombre = this.crearForm.get('nombre')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.epocaVisitarService.verificarEpocaVisitarExistente(nombre).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'La Epoca ya existe',
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
            title: 'Error al verificar La Epoca',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: EpocaVisitar): void {
    console.log('Datos de la Epoca:', tipoData);
    this.epocaVisitarService.guardarEpocaVisitar(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'La Epoca fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar La Epoca'
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
    this.router.navigate(['/epoca-visitar']);
  }

}
