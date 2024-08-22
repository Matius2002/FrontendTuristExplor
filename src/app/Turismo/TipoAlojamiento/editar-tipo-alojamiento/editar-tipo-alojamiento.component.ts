import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TipoAlojamientoService} from "../tipo-alojamiento.service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TipoTurismoService} from "../../TipoTurismo/tipo-turismo.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import Swal from "sweetalert2";
interface TipoAlojamiento{
  id: number;
  nombre: string;
  descripcion: string;
  servicios: string;
  precioPromedio: number;
}
@Component({
  providers: [HttpClient, TipoAlojamientoService],
  selector: 'app-editar-tipo-alojamiento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
  ],
  templateUrl: './editar-tipo-alojamiento.component.html',
  styleUrl: './editar-tipo-alojamiento.component.css'
})
export class EditarTipoAlojamientoComponent implements OnInit{
  editarForm!: FormGroup;
  tipoAlojamiento!: TipoAlojamiento;
  constructor(
    public dialogRef: MatDialogRef<EditarTipoAlojamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tipoAlojamientoService: TipoAlojamientoService,
    private formBuilder: FormBuilder,
  ) {
    this.tipoAlojamiento = data.tipoAlojamiento;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.tipoAlojamiento.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.tipoAlojamiento.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      servicios: [this.tipoAlojamiento.servicios, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      precioPromedio: [this.tipoAlojamiento.precioPromedio, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.editarForm.valid) {
      const tipoActualizado = this.editarForm.value;
      this.tipoAlojamientoService.actualizarTipoAlojamiento(this.tipoAlojamiento.id, tipoActualizado).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El Tipo de Alojamiento se ha actualizado correctamente.', 'success');
        },
        error => {
          this.dialogRef.close('error');
          Swal.fire('¡Error!', 'Hubo un error al actualizar el Tipo de Alojamiento.', 'error');
          console.error(error);
        }
      );
    } else {
      this.editarForm.markAllAsTouched();
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onClearForm(): void {
    this.editarForm.reset();
  }
}
