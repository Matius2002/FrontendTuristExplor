import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {EventoService} from "../evento.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

interface Destinos{
  id: number;
  destinoName: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Evento{
  id: number;
  destino: Destinos;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
}
@Component({
  providers: [EventoService, HttpClient],
  selector: 'app-evento-contenido',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    HttpClientModule,
  ],
  templateUrl: './evento-contenido.component.html',
  styleUrl: './evento-contenido.component.css'
})
export class EventoContenidoComponent implements OnInit{
  crearForm!: FormGroup;
  eventos: Evento[] = [];
  destinos: Destinos [] = [];
  imagenes: Images []=[];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  constructor(
    private eventoService: EventoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarEvento();
  }

  cargarEvento() {
    // Lógica para cargar los datos de la base de datos.
    this.eventoService.recuperarTodosEvento().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.eventos = data.map(evento => {
          return {
            id: evento.id,
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            destino: evento.destino,
            fechaInicio: evento.fechaInicio,
            fechaFin: evento.fechaFin,
            ubicacion: evento.ubicacion,
            costoEntrada: evento.costoEntrada,
            images: evento.images
          };
        });
        this.totalPages = Math.ceil(this.eventos.length / this.itemsPerPage);

        console.log("Datos de los eventos cargados correctamente:", this.eventos);
      },
      error => {
        console.error('Error al cargar los eventos:', error);
      }
    );
  }


}
