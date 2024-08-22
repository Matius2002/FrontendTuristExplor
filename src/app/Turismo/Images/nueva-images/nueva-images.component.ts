import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {ImagesService} from "../images.service";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";

interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

@Component({
  providers: [ImagesService,HttpClient],
  selector: 'app-nueva-images',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    NgForOf,
  ],
  templateUrl: './nueva-images.component.html',
  styleUrl: './nueva-images.component.css'
})
export class NuevaImagesComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  crearForm!: FormGroup;
  imagenes!: Images;
  selectedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private imagesService: ImagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      ruta: ['', [Validators.required]],
      activa: ['true']
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && this.validarTipoArchivo(file) && this.validarTamanoArchivo(file)) {
      this.selectedFiles = [file];
      const fileName = this.crearForm.get('nombre')?.value + this.getFileExtension(file.name);
      this.crearForm.patchValue({ ruta: fileName });
    } else {
      this.fileInput.nativeElement.value = ''; // Limpiar el campo de selección de archivo
      Swal.fire('Error', 'Formato de archivo no válido o tamaño excedido. Solo se permiten archivos JPG, PNG, GIF o BMP de hasta 500MB.', 'error');
    }
  }

  onSubmit(): void {
    if (this.crearForm.invalid) {
      return;
    }

    const formData: FormData = new FormData();
    formData.append('archivo', this.selectedFiles[0], this.crearForm.get('nombre')?.value + this.getFileExtension(this.selectedFiles[0].name));
    formData.append('nombre', this.crearForm.get('nombre')?.value);

    this.imagesService.guardarImagenes(formData).pipe(
      catchError(error => {
        Swal.fire('Error', 'No se pudo cargar la imagen. Intente de nuevo.', 'error');
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        Swal.fire('Éxito', 'La imagen se ha cargado exitosamente.', 'success');
        this.limpiarFormulario(); // Limpiar el formulario después de cargar la imagen exitosamente
      }
    });
  }

  getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }

  limpiarFormulario() {
    this.crearForm.reset(); // Resetear el formulario
    this.selectedFiles = []; // Limpiar el arreglo de archivos seleccionados
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Limpiar el campo de selección de archivo
    }
  }

  volver() {
    this.router.navigate(['/images']);
  }

  eliminarFoto(): void {
    this.selectedFiles = [];
    this.crearForm.patchValue({ ruta: '' });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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
    const tamanioMaximo = 500 * 1024 * 1024; // 500MB en bytes
    return archivo.size <= tamanioMaximo;
  }
}
//
