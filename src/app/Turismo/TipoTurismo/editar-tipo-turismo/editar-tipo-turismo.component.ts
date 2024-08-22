import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TipoTurismoService} from "../tipo-turismo.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";

interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
@Component({
  providers: [HttpClient, TipoTurismoService],
  selector: 'app-editar-tipo-turismo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
  ],
  templateUrl: './editar-tipo-turismo.component.html',
  styleUrl: './editar-tipo-turismo.component.css'
})
export class EditarTipoTurismoComponent implements OnInit{
  editarForm!: FormGroup;
  tipoTurismo!: TipoTurismo;

  constructor(
    public dialogRef: MatDialogRef<EditarTipoTurismoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tipoTurismoService: TipoTurismoService,
    private formBuilder: FormBuilder,
  ) {
    this.tipoTurismo = data.tipoTurismo;
  }

  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.tipoTurismo.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.tipoTurismo.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      popularidad: [this.tipoTurismo.popularidad, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.editarForm.valid) {
      const tipoActualizado = this.editarForm.value;
      this.tipoTurismoService.actualizarTipo(this.tipoTurismo.id, tipoActualizado).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El Tipo de Turismo se ha actualizado correctamente.', 'success');
        },
        error => {
          Swal.fire('¡Error!', 'Hubo un error al actualizar el Tipo de Turismo.', 'error');
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
