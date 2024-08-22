import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NoticiaService} from "../noticia.service";
import {FormGroup, FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
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
  providers: [NoticiaService],
  selector: 'app-detalle-noticia',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgIf,
    NgClass,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './detalle-noticia.component.html',
  styleUrl: './detalle-noticia.component.css'
})
export class DetalleNoticiaComponent implements OnInit{
  crearForm!: FormGroup;
  noticias: Noticia[] = [];
  tipoTurismos: TipoTurismo[] = [];
  imagenes: Images[] = [];
  isModalOpen: boolean = false;
  selectedImage: any = null;

  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';
  searchText: string = '';

  noticiaId: number = 0;
  selectedNoticia: Noticia | null = null;

  getImageUrl(imagePath: string): string {
    const url = `http://localhost:8080/api${imagePath}`;
    console.log(`Imagen con URL: ${url}`);
    return url;
  }

  constructor(private noticiaService: NoticiaService,
              private router: Router,
              private route: ActivatedRoute
              )
  {

  }


  // Método para abrir el modal
  openModal(imagen: any) {
    console.log('Selected Image:', imagen);
    this.selectedImage = imagen;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.noticiaId = +params['id'];
      this.cargarNoticia();
    });
  }

  cargarNoticia() {
    if (this.noticiaId) {
      this.noticiaService.obtenerNoticia(this.noticiaId).subscribe(
        data => {
          console.log("Datos recibidos del servidor:", data);
          this.selectedNoticia = data;
        },
        error => {
          console.error('Error al cargar la Noticia:', error);
        }
      );
    } else {
      this.cargarNoticiasContenido();
    }
  }

  cargarNoticiasContenido() {
    this.noticiaService.recuperarTodosNoticia().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        this.noticias = data.map(noticia => {
          return {
            id: noticia.id,
            titulo: noticia.titulo,
            contenido: noticia.contenido,
            fechaPublicacion: noticia.fechaPublicacion,
            fuente: noticia.fuente,
            images: noticia.images,
            tipoTurismo: noticia.tipoTurismo,
          };
        });
        this.totalPages = Math.ceil(this.noticias.length / this.itemsPerPage);
        console.log("Datos de las Noticias cargados correctamente:", this.noticias);
      },
      error => {
        console.error('Error al cargar las Noticias:', error);
      }
    );
  }
  getFilteredNoticias(): Noticia[] {
    if (!this.searchText) {
      return this.noticias;
    }
    const searchTextLower = this.searchText.toLowerCase();
    return this.noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(searchTextLower) ||
      noticia.tipoTurismo.nombre.toLowerCase().includes(searchTextLower)
    );
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }
  verTodasLasNoticias() {
    this.router.navigate(['/noticia-contenido']);
  }
}
