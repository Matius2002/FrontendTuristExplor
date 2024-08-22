import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AlojamientoService} from "../alojamiento.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
interface Destinos {
  id: number;
  destinoName: string;
}
interface  TipoAlojamiento{
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Alojamiento{
  id: number;
  descripcion: string;
  destinos: Destinos [];
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  direccion: string;
  celular: string;
  email: string;
  webUrl: string;
  precioGeneral: number;
  fechaCreacion: Date;
  imagenes: Images[];
}
@Component({
  providers: [HttpClient, AlojamientoService],
  selector: 'app-editar-alojamiento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-alojamiento.component.html',
  styleUrl: './editar-alojamiento.component.css'
})
export class EditarAlojamientoComponent implements OnInit{
  editarForm!: FormGroup;
  alojamientos!: Alojamiento;
  tipoAlojamientos: TipoAlojamiento []=[];
  destinos: Destinos[] = [];
  imagenes: Images []=[];

  constructor(
    public dialogRef: MatDialogRef<EditarAlojamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alojamientoService: AlojamientoService,
    private formBuilder: FormBuilder,
  ) {
    this.alojamientos = data.alojamientos;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      descripcion: [this.alojamientos.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      destinos: [this.alojamientos.destinos.map(d => d.id), Validators.required],
      nombre: [this.alojamientos.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      tipoAlojamiento: [this.alojamientos.tipoAlojamiento.id, Validators.required],
      direccion: [this.alojamientos.direccion, Validators.required],
      celular: [this.alojamientos.celular, [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      email: [this.alojamientos.email, [Validators.required, Validators.email]],
      webUrl: [this.alojamientos.webUrl, Validators.required],
      precioGeneral: [this.alojamientos.precioGeneral, [Validators.required, Validators.min(0)]],
      fechaCreacion: [this.formatDate(this.alojamientos.fechaCreacion), Validators.required],
      imagenes: [this.alojamientos.imagenes.map(i => i.id), Validators.required]
    });

    this.cargarDatosIniciales();
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  private findSelectedItems(array: any[], ids: number[]): any[] {
    return array.filter(item => ids.includes(item.id));
  }

  private cargarDatosIniciales(): void {
    this.alojamientoService.recuperarTodosDestinos().subscribe(
      (destinos: Destinos[]) => {
        this.destinos = destinos;
      },
      error => {
        console.error('Error al recuperar destinos:', error);
      }
    );

    this.alojamientoService.recuperarTodosTiposAlojamiento().subscribe(
      (tipos: TipoAlojamiento[]) => {
        this.tipoAlojamientos = tipos;
      },
      error => {
        console.error('Error al recuperar tipos de alojamiento:', error);
      }
    );

    this.alojamientoService.recuperarTodosImages().subscribe(
      (imagenes: Images[]) => {
        this.imagenes = imagenes;
      },
      error => {
        console.error('Error al recuperar imágenes:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editarForm.valid) {
      const formData = this.editarForm.value;
      formData.destinos = this.findSelectedItems(this.destinos, formData.destinos);
      formData.imagenes = this.findSelectedItems(this.imagenes, formData.imagenes);

      this.alojamientoService.actualizarAlojamiento(this.alojamientos.id, formData).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El alojamiento se ha actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar alojamiento:', error);
          Swal.fire('¡Error!', 'Hubo un error al actualizar el alojamiento.', 'error');
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
