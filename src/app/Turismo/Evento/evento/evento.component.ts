import {Component, OnInit} from '@angular/core';
import {EventoService} from "../evento.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule, DecimalPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCell, MatCellDef} from "@angular/material/table";
import {FormsModule} from "@angular/forms";
import {TooltipDirective} from "../../../../tooltip.directive";
import {NgxPaginationModule} from "ngx-pagination";
import {FilterPipe} from "../../../FilterPipe";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import * as ExcelJS from "exceljs";
import {EditarEventoComponent} from "../editar-evento/editar-evento.component";

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
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [EventoService, HttpClient],
  selector: 'app-evento',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    DecimalPipe,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCell,
    MatCellDef,
    FormsModule,
    TooltipDirective,
    NgxPaginationModule,
    FilterPipe,
  ],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  eventos: Evento[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  eventoToDelete: Evento | null = null;
  eventoEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private eventoService: EventoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarEvento();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar evento
  openUpdateModal(evento: Evento): void {
    const dialogRef = this.dialog.open(EditarEventoComponent, {
      width: '400px',
      data: {evento}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Evento se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar El Evento.', 'error');
      }
    });
  }
  protected readonly Math = Math;
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
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Eventos');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'nombre', width: 30},
      {header: 'Descripción', key: 'descripcion', width: 50},
      {header: 'Destino', key: 'destino', width: 15},
      {header: 'Fecha Inicio', key: 'fechaInicio', width: 15},
      {header: 'Fecha Fin', key: 'fechaFin', width: 15},
      {header: 'Ubicacion', key: 'ubicacion', width: 15},
      {header: 'Costo Entrada', key: 'costoEntrada', width: 15},
      {header: 'Images', key: 'images', width: 30},
    ];
    this.eventos.forEach(evento => {
      worksheet.addRow(evento);
    });
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  sortColumn(columnName: string) {
    if (this.currentColumn === columnName) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentColumn = columnName;
      this.sortOrder = 'asc';
    }
    this.sortData();
  }
  sortData() {
    if (this.currentColumn) {
      this.eventos.sort((a, b) => {
        const aValue = a.id;
        const bValue = b.id;
        if (aValue < bValue) {
          return this.sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  }
  //Metodo para Eliminar
  onEliminarEvento(evento: Evento) {
    this.eventoToDelete = evento;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.eventoToDelete) {
      const tipoId = this.eventoToDelete.id;
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showAlert = false;
          this.eventoService.eliminarEvento(tipoId).subscribe(() => {
            this.eventos = this.eventos.filter(p => p.id !== tipoId);
            this.eventoToDelete = null;
            this.eventoEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.eventoEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Evento ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Evento:', error);
            this.errorMessage = 'Hubo un error al eliminar El Evento. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Evento.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { nombre: string; }) => {
        const itemText = item.nombre.toLowerCase();
        return searchKeywords.every(keyword => itemText.includes(keyword));
      });
      this.searchNotFound = this.filteredItems.length === 0;
      this.updateTable();
    } else {
      this.displayedItems = [];
      this.searchNotFound = false;
    }
  }
  updateTable() {
    this.displayedItems = this.filteredItems;
  }
  highlightMatches(content: string, keyword: string): string {
    if (!keyword.trim()) return content;
    const regex = new RegExp(keyword, 'gi');
    return content.replace(regex, match => `<span class="highlight">${match}</span>`);
  }

  onNuevoEvento() {
    this.router.navigate(['/nuevo-evento']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}

