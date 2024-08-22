import {Component, OnInit} from '@angular/core';
import {FormGroup, FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TipoTurismoService} from "../tipo-turismo.service";
import {DestinoService} from "../../Destinos/destino.service";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FilterPipe} from "../../../FilterPipe";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
interface TipoTurismo{
  id: number;
  nombre: string;
}
interface AtracionesPrincipales{
  id: number;
  nombre: string;
}
interface EpocasVisitar{
  id: number;
  nombre: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

interface Destinos {
  id: number;
  destinoName: string;
  descripcion: string;
  ubicacion: string;
  tipoTurismo: TipoTurismo[];
  atracionesPrincipales: AtracionesPrincipales [];
  epocasVisitar: EpocasVisitar [];
  imagenes: Images [];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
@Component({
  providers: [HttpClient, TipoTurismoService, DestinoService],
  selector: 'app-turismo-religioso',
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
  templateUrl: './turismo-religioso.component.html',
  styleUrl: './turismo-religioso.component.css'
})
export class TurismoReligiosoComponent implements OnInit{
  crearForm!: FormGroup;
  destinos: Destinos []=[];
  tipoTurismos: TipoTurismo []=[];
  atracionesPrincipales: AtracionesPrincipales [] = [];
  imagenes: Images []=[];
  epocasVisitar: EpocasVisitar [] = [];
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
    private tipoTurismoService: TipoTurismoService,
    private destinoService: DestinoService,
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
    this.cargarReligiosos();
  }
  cargarReligiosos() {
    this.destinoService.recuperarTodosDestinos().subscribe(
      (data: any) => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);

        // Filtrar destinos para incluir solo aquellos con tipo de turismo "Religioso"
        this.destinos = data
          .map((destino: any) => ({
            id: destino.id,
            destinoName: destino.destinoName,
            descripcion: destino.descripcion,
            ubicacion: destino.ubicacion,
            tipoTurismo: destino.tipoTurismo,
            atracionesPrincipales: destino.atracionesPrincipales,
            epocasVisitar: destino.epocasVisitar,
            imagenes: destino.imagenes,
            fechaCreacion: new Date(destino.fechaCreacion),
            fechaActualizacion: new Date(destino.fechaActualizacion),
          }))
          .filter((destino: any) => destino.tipoTurismo.some((tipo: any) => tipo.nombre === 'Turismo Religioso'));

        this.totalPages = Math.ceil(this.destinos.length / this.itemsPerPage);
        console.log("Datos de los destinos religiosos cargados correctamente:", this.destinos);
      },
      error => {
        console.error('Error al cargar los destinos:', error);
      }
    );
  }
  getFilteredDestinos(): Destinos[] {
    if (!this.searchText) {
      return this.destinos; // Si no hay texto de búsqueda, muestra todos los destinos
    }
    const searchTextLower = this.searchText.toLowerCase(); // Convierte a minúsculas para la búsqueda
    return this.destinos.filter(destino =>
      destino.destinoName.toLowerCase().includes(searchTextLower) ||
      destino.descripcion.toLowerCase().includes(searchTextLower) ||
      destino.tipoTurismo.some(tipo => tipo.nombre.toLowerCase().includes(searchTextLower))
    );
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }

}
