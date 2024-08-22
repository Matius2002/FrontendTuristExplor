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
import {AtracionesService} from "../atraciones.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {EditarAtracionesComponent} from "../editar-atraciones/editar-atraciones.component";
import * as ExcelJS from "exceljs";
interface Atraciones{
  id: number;
  nombre: string;
  descripcion: string;
  horarioFuncionamiento: string;
  horarioFin: string;
}
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [AtracionesService, HttpClient],
  selector: 'app-atraciones-principal',
  standalone: true,
  imports: [
    FilterPipe,
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
  templateUrl: './atraciones-principal.component.html',
  styleUrl: './atraciones-principal.component.css'
})
export class AtracionesPrincipalComponent implements  OnInit{
  isHelpModalVisible: boolean = false;
  atraciones: Atraciones[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // Eliminar
  showAlert: boolean = false;
  atracionesToDelete: Atraciones | null = null;
  atracionesEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private atracionesService: AtracionesService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarAtraciones();
  }
  //Imprimir
  printTable() {
    window.print();
  }
// Actualizar atraccion
  openUpdateModal(atraccion: Atraciones): void {
    const dialogRef = this.dialog.open(EditarAtracionesComponent, {
      width: '400px',
      data: { atraciones: atraccion }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'La Atracción se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar la Atracción.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarAtraciones() {
    // Lógica para cargar los datos de la base de datos.
    this.atracionesService.recuperarTodosAtraciones().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.atraciones = data.map(atraccion => {
          return {
            id: atraccion.id,
            nombre: atraccion.nombre,
            descripcion: atraccion.descripcion,
            horarioFuncionamiento: atraccion.horarioFuncionamiento,
            horarioFin: atraccion.horarioFin,
          };
        });
        this.totalPages = Math.ceil(this.atraciones.length / this.itemsPerPage);

        console.log("Datos de los tipos de Alojamiento cargados correctamente:", this.atraciones);
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
      {header: 'horario Funcionamiento', key: 'horarioFuncionamiento', width: 15},
      {header: 'horario Fin', key: 'horarioFin', width: 15},

    ];
    this.atraciones.forEach(atraccion => {
      worksheet.addRow(atraccion);
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
      this.atraciones.sort((a, b) => {
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
  onEliminarAtraccion(atraccion: Atraciones) {
    this.atracionesToDelete = atraccion;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.atracionesToDelete) {
      const tipoId = this.atracionesToDelete.id;
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
          this.atracionesService.eliminarAtraciones(tipoId).subscribe(() => {
            this.atraciones = this.atraciones.filter(p => p.id !== tipoId);
            this.atracionesToDelete = null;
            this.atracionesEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.atracionesEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'La Atracción ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar La Atracción :', error);
            this.errorMessage = 'Hubo un error al eliminar La Atracción . Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar La Atracción .', 'error');
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

  onNuevaAtraccion() {
    this.router.navigate(['/nueva-atracciones']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
