import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NoticiaService} from "../noticia.service";
import {NgForOf, NgIf} from "@angular/common";
import Swal from "sweetalert2";
interface TipoTurismo {
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  fuente: string;
  images: Images[];
  tipoTurismo: TipoTurismo;
}
@Component({
  providers: [HttpClient, NoticiaService],
  selector: 'app-editar-noticia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-noticia.component.html',
  styleUrl: './editar-noticia.component.css'
})
export class EditarNoticiaComponent implements OnInit{
  editarForm!: FormGroup;
  noticias!: Noticia;
  imagenes: Images []=[];
  tipoTurismo: TipoTurismo []=[];

  constructor(
    public dialogRef: MatDialogRef<EditarNoticiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private noticiaService: NoticiaService,
    private formBuilder: FormBuilder,
  ) {
    this.noticias = data.noticias;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      titulo: [this.noticias.titulo, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      contenido: [this.noticias.contenido, [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      fuente: [this.noticias.fuente, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      fechaPublicacion: [this.formatDate(this.noticias.fechaPublicacion), Validators.required],
      images: [this.noticias.images.map(i => i.id), Validators.required],
      tipoTurismo: [this.noticias.tipoTurismo.id, Validators.required],
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
    this.noticiaService.recuperarTodosTipos().subscribe(
      (tipos: TipoTurismo[]) => {
        this.tipoTurismo = tipos;
      },
      error => {
        console.error('Error al recuperar tipos de turismo:', error);
      }
    );

    this.noticiaService.recuperarTodosImages().subscribe(
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
      formData.images = this.findSelectedItems(this.imagenes, formData.images);
      formData.tipoTurismo = this.tipoTurismo.find(t => t.id === formData.tipoTurismo);

      this.noticiaService.actualizarNoticia(this.noticias.id, formData).subscribe(
        () => {
          this.dialogRef.close('success');
          Swal.fire('¡Actualizado!', 'La noticia se ha actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar noticia:', error);
          Swal.fire('¡Error!', 'Hubo un error al actualizar la noticia.', 'error');
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
