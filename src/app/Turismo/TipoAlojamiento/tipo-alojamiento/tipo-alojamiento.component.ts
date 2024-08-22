import {Component, OnInit} from '@angular/core';
import {FilterPipe} from "../../../FilterPipe";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule, DecimalPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCell, MatCellDef} from "@angular/material/table";
import {FormsModule} from "@angular/forms";
import {TooltipDirective} from "../../../../tooltip.directive";
import {NgxPaginationModule} from "ngx-pagination";
import {MatDialog} from "@angular/material/dialog";
import {TipoAlojamientoService} from "../tipo-alojamiento.service";
import Swal from "sweetalert2";
import {EditarTipoAlojamientoComponent} from "../editar-tipo-alojamiento/editar-tipo-alojamiento.component";
import * as ExcelJS from "exceljs";
import {Router} from "@angular/router";

interface TipoAlojamiento{
  id: number;
  nombre: string;
  descripcion: string;
  servicios: string;
  precioPromedio: string;
}
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [TipoAlojamientoService, HttpClient],
  selector: 'app-tipo-alojamiento',
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
  templateUrl: './tipo-alojamiento.component.html',
  styleUrl: './tipo-alojamiento.component.css'
})
export class TipoAlojamientoComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  tipoAlojamientos: TipoAlojamiento[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  tipoAlojamientoToDelete: TipoAlojamiento | null = null;
  tipoAlojamientoEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private tipoAlojamientoService: TipoAlojamientoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarTipoAlojamiento();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar alojamiento
  openUpdateModal(tipoAlojamiento: TipoAlojamiento): void {
    const dialogRef = this.dialog.open(EditarTipoAlojamientoComponent, {
      width: '400px',
      data: {tipoAlojamiento}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Tipo de Alojamiento se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar El Tipo de Alojamiento.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarTipoAlojamiento() {
    // Lógica para cargar los datos de la base de datos.
    this.tipoAlojamientoService.recuperarTodosTiposAlojamineto().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.tipoAlojamientos = data.map(tipoAlojamiento => {
          return {
            id: tipoAlojamiento.id,
            nombre: tipoAlojamiento.nombre,
            descripcion: tipoAlojamiento.descripcion,
            servicios: tipoAlojamiento.servicios,
            precioPromedio: tipoAlojamiento.precioPromedio,
          };
        });
        this.totalPages = Math.ceil(this.tipoAlojamientos.length / this.itemsPerPage);

        console.log("Datos de los tipos de Alojamiento cargados correctamente:", this.tipoAlojamientos);
      },
      error => {
        console.error('Error al cargar los tipos de Alojamiento:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TipoAlojamiento');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'nombre', width: 30},
      {header: 'Descripción', key: 'descripcion', width: 15},
      {header: 'Servicios', key: 'servicios', width: 15},
      {header: 'precio Promedio', key: 'precioPromedio', width: 15},

    ];
    this.tipoAlojamientos.forEach(tipoAlojamiento => {
      worksheet.addRow(tipoAlojamiento);
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
      this.tipoAlojamientos.sort((a, b) => {
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
  onEliminarTipoAlojamiento(tipoAlojamiento: TipoAlojamiento) {
    this.tipoAlojamientoToDelete = tipoAlojamiento;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.tipoAlojamientoToDelete) {
      const tipoId = this.tipoAlojamientoToDelete.id;
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
          this.tipoAlojamientoService.eliminarTipoAlojamiento(tipoId).subscribe(() => {
            this.tipoAlojamientos = this.tipoAlojamientos.filter(p => p.id !== tipoId);
            this.tipoAlojamientoToDelete = null;
            this.tipoAlojamientoEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.tipoAlojamientoEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Tipo de Alojamiento ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Tipo de Alojamiento :', error);
            this.errorMessage = 'Hubo un error al eliminar El Tipo de Alojamiento . Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Tipo de Alojamiento .', 'error');
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

  onNuevoTipo() {
    this.router.navigate(['/nuevo-tipoAlojamiento']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
