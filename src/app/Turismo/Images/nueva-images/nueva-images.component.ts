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
  isSubmitting: boolean = false;

  //Carga de Fotos
  selectedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevaImagesComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private imagesService: ImagesService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      ruta: ['', [Validators.required]],
      activa: ['true'] // Establecer el valor de activa como 'true' por defecto
    });
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    if (this.selectedFiles.length > 0) {
      const fileName = this.crearForm.get('nombre')?.value + this.getFileExtension(this.selectedFiles[0].name);
      this.crearForm.patchValue({ ruta: fileName });
    }
  }

  onSubmit(): void {
    console.log('Envío de formulario iniciado');
    if (this.crearForm.invalid) {
      return;
    }
    console.log('El formulario es válido y no se envía.');

    const formData: FormData = new FormData();
    formData.append('archivo', this.selectedFiles[0], this.crearForm.get('nombre')?.value + this.getFileExtension(this.selectedFiles[0].name));
    formData.append('nombre', this.crearForm.get('nombre')?.value);

    this.isSubmitting = true;
    console.log('Envío de datos del formulario');
    this.imagesService.guardarImagenes(formData).pipe(
      catchError(error => {
        this.isSubmitting = false;
        Swal.fire('Error', 'No se pudo cargar la imagen. Intente de nuevo.', 'error');
        return of(null);
      })
    ).subscribe((response) => {
      this.isSubmitting = false;
      console.log('Se recibió la respuesta de envío del formulario');
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
    this.crearForm.reset();
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  volver() {
    this.router.navigate(['/images']);
  }
  eliminarFoto(): void {
    this.selectedFiles = [];
    this.crearForm.patchValue({ ruta: null });
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
    const tamanioMaximo = 500 * 1024 * 1024; // 500MB en bytes
    return archivo.size <= tamanioMaximo;
  }
}
