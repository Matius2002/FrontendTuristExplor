import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {EventoService} from "../evento.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

interface Destinos {
  id: number;
  destinoName: string;
}

interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

interface Evento {
  id: number;
  destinos: Destinos[];
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
}
@Component({
  providers: [HttpClient, EventoService],
  selector: 'app-editar-evento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent implements OnInit{
  editarForm!: FormGroup;
  eventos!: Evento;
  destinos: Destinos[] = [];
  imagenes: Images[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.eventos = this.data.eventos;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.eventos.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.eventos.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      ubicacion: [this.eventos.ubicacion, Validators.required],
      costoEntrada: [this.eventos.costoEntrada, Validators.required],
      fechaInicio: [this.formatDate(this.eventos.fechaInicio), Validators.required],
      fechaFin: [this.formatDate(this.eventos.fechaFin), Validators.required],
      destinos: [this.eventos.destinos.map(d => d.id), Validators.required],
      images: [this.eventos.images.map(i => i.id), Validators.required],
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

    this.eventoService.recuperarDestinos().subscribe(
      (destinos: Destinos[]) => {
        this.destinos = destinos;
      },
      error => {
        console.error('Error al recuperar destinos:', error);
      }
    );

    this.eventoService.recuperarImages().subscribe(
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
      formData.images = this.findSelectedItems(this.imagenes, formData.images);

      this.eventoService.actualizarEvento(this.eventos.id, formData).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El evento se ha actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar evento:', error);
          Swal.fire('¡Error!', 'Hubo un error al actualizar el evento.', 'error');
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
