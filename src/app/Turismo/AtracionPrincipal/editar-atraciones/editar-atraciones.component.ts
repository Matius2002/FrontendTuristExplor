import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AtracionesService} from "../atraciones.service";
import Swal from "sweetalert2";

interface Atraciones{
  id: number;
  nombre: string;
  descripcion: string;
  horarioFuncionamiento: string;
  horarioFin: string;
}
@Component({
  providers: [HttpClient, AtracionesService],
  selector: 'app-editar-atraciones',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
  ],
  templateUrl: './editar-atraciones.component.html',
  styleUrl: './editar-atraciones.component.css'
})
export class EditarAtracionesComponent implements OnInit{
  editarForm!: FormGroup;
  atraciones!: Atraciones;

  constructor(
    public dialogRef: MatDialogRef<EditarAtracionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private atracionesService: AtracionesService,
    private formBuilder: FormBuilder,
  ) {
    this.atraciones = data.atraciones;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.data.atraciones.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.data.atraciones.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      horarioFuncionamiento: [this.data.atraciones.horarioFuncionamiento, [Validators.required]],
      horarioFin: [this.data.atraciones.horarioFin, [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.editarForm.valid) {
      const atraccionActualizada = this.editarForm.value;
      this.atracionesService.actualizarAtraciones(this.atraciones.id, atraccionActualizada).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'La Atracción Turística se ha actualizado correctamente.', 'success');
        },
        error => {
          Swal.fire('¡Error!', 'Hubo un error al actualizar la Atracción Turística.', 'error');
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
