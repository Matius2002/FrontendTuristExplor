import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NoticiaService} from "../noticia.service";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {catchError, of} from "rxjs";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

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
  imagenes: Images[];
  tipoTurismos: TipoTurismo [];
}

@Component({
  providers: [NoticiaService, HttpClient],
  selector: 'app-nueva-noticia',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './nueva-noticia.component.html',
  styleUrl: './nueva-noticia.component.css'
})
export class NuevaNoticiaComponent implements OnInit {
  crearForm!: FormGroup;
  noticias!: Noticia;
  imagenes: Images []=[];
  tipoTurismos: TipoTurismo []=[];

  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NuevaNoticiaComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private noticiaService: NoticiaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crearForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      fechaPublicacion: ['', [Validators.required]],
      fuente: ['', [Validators.required]],
      imagenes: ['', [Validators.required]],
      tipoTurismos: ['', [Validators.required]],
    });

    this.cargarImages();
    this.cargarTipos();

  }
  cargarImages(): void{
    this.noticiaService.recuperarTodosImages().subscribe(
      (imagenes: Images[]) =>{
        this.imagenes = imagenes;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cargarTipos(): void{
    this.noticiaService.recuperarTodosTipos().subscribe(
      (tiposTurismo: TipoTurismo[]) =>{
        this.tipoTurismos = tiposTurismo;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.crearForm.valid) {
      const titulo = this.crearForm.get('titulo')!.value;
      this.isSubmitting = true; // Iniciar la animación de carga
      this.noticiaService.verificarNoticiaExistente(titulo).pipe(
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      ).subscribe({
        next: (isExistente) => {
          if (isExistente) {
            Swal.fire({
              icon: 'error',
              title: 'La Noticia ya existe',
              text: 'Ingrese un nombre diferente'
            });
          } else {
            const formData = this.crearForm.value as Noticia;
            this.guardarTipo(formData);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar La Noticia',
            text: error.message
          });
        }
      });
    }
  }

  guardarTipo(tipoData: Noticia): void {
    console.log('Datos de La Noticia:', tipoData);
    this.noticiaService.guardarNoticia(tipoData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'La Noticia fue creada correctamente',
        showConfirmButton: false,
        timer: 2500
      });
      this.crearForm.reset();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar La Noticia'
      });
    });
  }
  limpiarFormulario() {
    this.crearForm.reset();
  }
  volver() {
    this.router.navigate(['/noticias']);
  }

}
