import {Component, OnInit} from '@angular/core';
import {FormGroup, FormsModule} from "@angular/forms";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FilterPipe} from "../../../FilterPipe";
import {AlojamientoService} from "../../Alojamiento/alojamiento.service";
import {EventoService} from "../../Evento/evento.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

interface Destinos {
  id: number;
  destinoName: string;
}
interface  TipoAlojamiento{
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Alojamiento{
  id: number;
  descripcion: string;
  destinos: Destinos [];
  nombre: string;
  tipoAlojamiento: TipoAlojamiento;
  direccion: string;
  celular: string;
  email: string;
  webUrl: string;
  precioGeneral: number;
  fechaCreacion: Date;
  imagenes: Images[];
}
@Component({
  providers: [HttpClient, AlojamientoService],
  selector: 'app-alojamiento-contenido',
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
  templateUrl: './alojamiento-contenido.component.html',
  styleUrl: './alojamiento-contenido.component.css'
})
export class AlojamientoContenidoComponent implements OnInit{
  crearForm!: FormGroup;
  alojamientos: Alojamiento[]= [];
  destinos: Destinos [] = [];
  imagen: Images []=[];
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
    private alojamientoService: AlojamientoService,
    private dialog: MatDialog,
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
    this.cargarAlojamiento();
  }

  cargarAlojamiento() {
    this.alojamientoService.recuperarTodosAlojamiento().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.alojamientos = data.map(alojamiento => ({
          id: alojamiento.id,
          nombre: alojamiento.nombre,
          descripcion: alojamiento.descripcion,
          destinos: alojamiento.destinos,
          tipoAlojamiento: alojamiento.tipoAlojamiento,
          direccion: alojamiento.direccion,
          celular: alojamiento.celular,
          email: alojamiento.email,
          webUrl: alojamiento.webUrl,
          precioGeneral: alojamiento.precioGeneral,
          fechaCreacion: new Date(alojamiento.fechaCreacion),
          imagenes: alojamiento.imagenes
        }));
        this.totalPages = Math.ceil(this.alojamientos.length / this.itemsPerPage);
        console.log("Datos de los alojamientos cargados correctamente:", this.alojamientos);
      },
      error => {
        console.error('Error al cargar los alojamientos:', error);
      }
    );
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }
}
