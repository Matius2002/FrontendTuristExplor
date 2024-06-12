import {Component, OnInit} from '@angular/core';
import {RolesService} from "../roles.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";

interface  Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}
@Component({
  providers: [RolesService, HttpClient],
  selector: 'app-nuevo-rol',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './nuevo-rol.component.html',
  styleUrl: './nuevo-rol.component.css'
})
export class NuevoRolComponent implements OnInit{
  crearForm!: FormGroup;
  roles!: Rol;
  isSubmitting: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevoRolComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private rolesService: RolesService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      rolName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      rolDescripc: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      rolFechaCreac: ['', [Validators.required]],
      rolFechaModic: ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.crearForm.valid) {
      const rolName = this.crearForm.get('rolName')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.rolesService.verificarRolExistente(rolName).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'El Rol ya existe',
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
            title: 'Error al verificar El Rol',
            text: error.message
          });
        }
      });
    } else {
    }
  }
  guardarTipo(tipoData: Rol): void {
    console.log('Datos de el Rol:', tipoData);
    this.rolesService.guardarRol(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'El Rol fue creado correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar El Rol'
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
    this.router.navigate(['/roles']);
  }

}
