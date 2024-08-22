import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {EventoService} from "../evento.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormGroup, FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FilterPipe} from "../../../FilterPipe";

interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
interface Destinos {
  id: number;
  destinoName: string;
}

interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

interface Evento {
  id: number;
  destinos: Destinos[];
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
  tipoTurismo: TipoTurismo;
}
@Component({
  providers: [EventoService, HttpClient],
  selector: 'app-evento-contenido',
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
  templateUrl: './evento-contenido.component.html',
  styleUrl: './evento-contenido.component.css'
})
export class EventoContenidoComponent implements OnInit{
  crearForm!: FormGroup;
  eventos: Evento[] = [];
  destinos: Destinos [] = [];
  imagen: Images []=[];

  isModalOpen: boolean = false;
  selectedImage: any = null;

  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';
  searchText: string = ''; // Variable para el texto de búsqueda

  eventosFiltrados: Evento[] = [];
  tipoTurismoFiltrado: string = '';

  getImageUrl(imagePath: string): string {
    const url = `http://localhost:8080/api${imagePath}`;
    console.log(`Imagen con URL: ${url}`);
    return url;
  }

  constructor(
    private eventoService: EventoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.eventosFiltrados = this.eventos;
  }
  ngOnInit(): void {
    this.cargarEvento();
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

  cargarEvento() {
    this.eventoService.recuperarTodosEvento().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.eventos = data.map(evento => ({
          id: evento.id,
          nombre: evento.nombre,
          descripcion: evento.descripcion,
          destinos: evento.destinos,
          fechaInicio: new Date(evento.fechaInicio),
          fechaFin: new Date(evento.fechaFin),
          ubicacion: evento.ubicacion,
          costoEntrada: evento.costoEntrada,
          images: evento.images,
          tipoTurismo: evento.tipoTurismo
        }));
        this.aplicarFiltros();
        this.totalPages = Math.ceil(this.eventos.length / this.itemsPerPage);
        console.log("Datos de los eventos cargados correctamente:", this.eventos);
      },
      error => {
        console.error('Error al cargar los eventos:', error);
      }
    );
  }

  aplicarFiltros(): void {
    this.eventosFiltrados = this.eventos.filter(evento =>
      (this.tipoTurismoFiltrado === '' || evento.tipoTurismo.nombre === this.tipoTurismoFiltrado) &&
      (this.searchText === '' ||
        evento.destinos.some(destino => destino.destinoName.toLowerCase().includes(this.searchText.toLowerCase())) ||
        evento.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
        evento.ubicacion.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  filtrarPorTipoTurismo(tipoTurismo: string) {
    this.tipoTurismoFiltrado = tipoTurismo;
    this.aplicarFiltros();
    this.scrollToEventos();
  }

  scrollToEventos() {
    const eventosLista = document.getElementById('eventos-lista');
    if (eventosLista) {
      eventosLista.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }

  verTodosLosEventos(): void {
    this.eventosFiltrados = this.eventos;
    const eventosListaElement = document.getElementById('eventos-lista');
    if (eventosListaElement) {
      eventosListaElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
