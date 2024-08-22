import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NoticiaService} from "../noticia.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormGroup, FormsModule} from "@angular/forms";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FilterPipe} from "../../../FilterPipe";

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
  providers:[NoticiaService, HttpClient],
  selector: 'app-noticias-contenido',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    HttpClientModule,
    NgOptimizedImage,
    DatePipe,
    CurrencyPipe,
    FilterPipe,
    FormsModule,
    NgClass,
  ],
  templateUrl: './noticias-contenido.component.html',
  styleUrl: './noticias-contenido.component.css'
})
export class NoticiasContenidoComponent implements OnInit{
  crearForm!: FormGroup;
  noticias: Noticia[] = [];
  tipoTurismos: TipoTurismo []=[];
  imagenes: Images []=[];
  isModalOpen: boolean = false;
  selectedImage: any = null;

  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';
  searchText: string = '';

  getImageUrl(imagePath: string): string {
    const url = `http://localhost:8080/api${imagePath}`;
    console.log(`Imagen con URL: ${url}`);
    return url;
  }
  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
  ) {
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
    this.cargarNoticiasContenido();
  }
  cargarNoticiasContenido() {
    // Lógica para cargar los datos de la base de datos.
    this.noticiaService.recuperarTodosNoticia().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
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

        console.log("Datos de la Noticia cargados correctamente:", this.noticias);
      },
      error => {
        console.error('Error al cargar las Noticias:', error);
      }
    );
  }
  // Añade este método a tu componente NoticiasContenidoComponent
  getFilteredNoticias(): Noticia[] {
    if (!this.searchText) {
      return this.noticias; // Si no hay texto de búsqueda, muestra todas las noticias
    }
    const searchTextLower = this.searchText.toLowerCase(); // Convierte a minúsculas para la búsqueda
    return this.noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(searchTextLower) ||
      noticia.tipoTurismo.nombre.toLowerCase().includes(searchTextLower)
    );
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }

}
