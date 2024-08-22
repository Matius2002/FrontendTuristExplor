import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {DestinoService} from "../destino.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import Swal from "sweetalert2";

interface TipoTurismo{
  id: number;
  nombre: string;
}
interface AtracionesPrincipales{
  id: number;
  nombre: string;
}
interface EpocasVisitar{
  id: number;
  nombre: string;
}
interface Images{
  id: number;
  ruta: string;
}

interface Destinos {
  id: number;
  destinoName: string;
  descripcion: string;
  ubicacion: string;
  tipoTurismo: TipoTurismo[];
  atracionesPrincipales: AtracionesPrincipales [];
  epocasVisitar: EpocasVisitar [];
  imagenes: Images [];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
@Component({
  selector: 'app-editar-destino',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-destino.component.html',
  styleUrl: './editar-destino.component.css',
  providers: [HttpClient, DestinoService]
})
export class EditarDestinoComponent implements OnInit {
  editarForm!: FormGroup;
  destinos!: Destinos;
  tipoTurismos: TipoTurismo[] = [];
  atracionesPrincipales: AtracionesPrincipales[] = [];
  imagenes: Images[] = [];
  epocasVisitar: EpocasVisitar[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarDestinoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private destinoService: DestinoService,
    private formBuilder: FormBuilder,
  ) {
    this.destinos = data.destinos;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      destinoName: [this.destinos.destinoName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      descripcion: [this.destinos.descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      ubicacion: [this.destinos.ubicacion, Validators.required],
      tipoTurismo: [this.destinos.tipoTurismo.map(t => t.id), Validators.required],
      atracionesPrincipales: [this.destinos.atracionesPrincipales.map(a => a.id), Validators.required],
      epocasVisitar: [this.destinos.epocasVisitar.map(e => e.id), Validators.required],
      fechaCreacion: [this.formatDate(this.destinos.fechaCreacion), Validators.required],
      fechaActualizacion: [this.formatDate(this.destinos.fechaActualizacion), Validators.required],
      imagenes: [this.destinos.imagenes.map(i => i.id), Validators.required]
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

    this.destinoService.recuperarTodosTiposTurismo().subscribe(
      (tipos: TipoTurismo[]) => {
        this.tipoTurismos = tipos;
      },
      error => {
        console.error('Error al recuperar tipos de turismo:', error);
      }
    );

    this.destinoService.recuperarAtracionesPrincipales().subscribe(
      (atracciones: AtracionesPrincipales[]) => {
        this.atracionesPrincipales = atracciones;
      },
      error => {
        console.error('Error al recuperar atracciones principales:', error);
      }
    );

    this.destinoService.recuperarEpocasVisitar().subscribe(
      (epocas: EpocasVisitar[]) => {
        this.epocasVisitar = epocas;
      },
      error => {
        console.error('Error al recuperar épocas para visitar:', error);
      }
    );

    this.destinoService.recuperarImages().subscribe(
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
      formData.tipoTurismo = this.findSelectedItems(this.tipoTurismos, formData.tipoTurismo);
      formData.atracionesPrincipales = this.findSelectedItems(this.atracionesPrincipales, formData.atracionesPrincipales);
      formData.epocasVisitar = this.findSelectedItems(this.epocasVisitar, formData.epocasVisitar);
      formData.imagenes = this.findSelectedItems(this.imagenes, formData.imagenes);

      this.destinoService.actualizarDestinos(this.destinos.id, formData).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'El destino se ha actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar destino:', error);
          Swal.fire('¡Error!', 'Hubo un error al actualizar el destino.', 'error');
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
