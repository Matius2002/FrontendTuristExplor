import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ImagesService} from "../images.service";
import Swal from "sweetalert2";
import {catchError, of} from "rxjs";
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
@Component({
  providers: [HttpClient, ImagesService],
  selector: 'app-editar-images',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './editar-images.component.html',
  styleUrl: './editar-images.component.css'
})
export class EditarImagesComponent implements OnInit{
  editarForm!: FormGroup;
  imagenes!: Images;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFiles: File[] = [];
  constructor(
    public dialogRef: MatDialogRef<EditarImagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private imagesService: ImagesService,
    private formBuilder: FormBuilder,
  ) {
    this.imagenes = data.imagenes;
  }
  ngOnInit(): void {
    this.editarForm = this.formBuilder.group({
      nombre: [this.imagenes.nombre, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      ruta: [this.imagenes.ruta, [Validators.required]],
      activa: [this.imagenes.activa]
    });
  }
  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    if (this.selectedFiles.length > 0) {
      const fileName = this.editarForm.get('nombre')?.value + this.getFileExtension(this.selectedFiles[0].name);
      this.editarForm.patchValue({ ruta: fileName });
    }
  }

  onSubmit(): void {
    if (this.editarForm.invalid) {
      return;
    }

    const formData: FormData = new FormData();
    formData.append('archivo', this.selectedFiles[0], this.editarForm.get('nombre')?.value + this.getFileExtension(this.selectedFiles[0].name));
    formData.append('nombre', this.editarForm.get('nombre')?.value);
    formData.append('activa', String(this.editarForm.get('activa')?.value));

    this.imagesService.actualizarImages(this.imagenes.id, formData).pipe(
      catchError(error => {
        Swal.fire('Error', 'No se pudo actualizar la imagen. Intente de nuevo.', 'error');
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        Swal.fire('Éxito', 'La imagen se ha actualizado exitosamente.', 'success');
        this.dialogRef.close(true);
      }
    });
  }

  getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }

  limpiarFormulario() {
    this.editarForm.reset();
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  eliminarFoto(): void {
    this.selectedFiles = [];
    this.editarForm.patchValue({ ruta: null });
    this.fileInput.nativeElement.value = '';
  }

  verFotoCompleta(): void {
    if (this.selectedFiles.length > 0) {
      const fileURL = URL.createObjectURL(this.selectedFiles[0]);
      window.open(fileURL, '_blank');
    }
  }

  descargarFoto(): void {
    if (this.selectedFiles.length > 0) {
      const fileURL = URL.createObjectURL(this.selectedFiles[0]);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = this.selectedFiles[0].name;
      a.click();
      URL.revokeObjectURL(fileURL);
    }
  }

  validarTipoArchivo(archivo: File): boolean {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    return tiposPermitidos.includes(archivo.type);
  }

  validarTamanoArchivo(archivo: File): boolean {
    const tamanioMaximo = 1000 * 1024 * 1024; // 1000MB en bytes
    return archivo.size <= tamanioMaximo;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onClearForm(): void {
    this.editarForm.reset();
  }
}
