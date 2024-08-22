import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {EpocaVisitarService} from "../epoca-visitar.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";

interface EpocaVisitar{
  id: number;
  nombre: string;
  descripcion: string;
  clima: string;
}
@Component({
  providers: [HttpClient, EpocaVisitarService],
  selector: 'app-editar-epoca-visitar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
  ],
  templateUrl: './editar-epoca-visitar.component.html',
  styleUrl: './editar-epoca-visitar.component.css'
})
export class EditarEpocaVisitarComponent implements OnInit{
  editarForm!: FormGroup;
  epocaVisitar!: EpocaVisitar;

  constructor(
    public dialogRef: MatDialogRef<EditarEpocaVisitarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private epocaVisitarService: EpocaVisitarService,
    private formBuilder: FormBuilder,
  ) {
    this.epocaVisitar = data.epocaVisitar;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.epocaVisitar.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.epocaVisitar.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      clima: [this.epocaVisitar.clima, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.editarForm.valid) {
      const epocaActualizada = this.editarForm.value;
      this.epocaVisitarService.actualizarEpocaVisitar(this.epocaVisitar.id, epocaActualizada).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'La Época de Visita se ha actualizado correctamente.', 'success');
        },
        error => {
          Swal.fire('¡Error!', 'Hubo un error al actualizar la Época de Visita.', 'error');
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
