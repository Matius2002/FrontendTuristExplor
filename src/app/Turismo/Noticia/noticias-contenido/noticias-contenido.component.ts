import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NoticiaService} from "../noticia.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

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
  providers:[NoticiaService, HttpClient],
  selector: 'app-noticias-contenido',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './noticias-contenido.component.html',
  styleUrl: './noticias-contenido.component.css'
})
export class NoticiasContenidoComponent implements OnInit{
  crearForm!: FormGroup;
  noticias: Noticia[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  constructor(
    private noticiaService: NoticiaService,
    private dialog: MatDialog,
    private router: Router,
  ) {
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
            imagenes: noticia.imagenes,
            tipoTurismos: noticia.tipoTurismos,
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

}
