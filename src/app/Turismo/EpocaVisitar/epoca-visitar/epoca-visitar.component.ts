import {Component, OnInit} from '@angular/core';
import {EpocaVisitarService} from "../epoca-visitar.service";
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
import {EditarEpocaVisitarComponent} from "../editar-epoca-visitar/editar-epoca-visitar.component";
import * as ExcelJS from "exceljs";
interface EpocaVisitar{
  id: number;
  nombre: string;
  descripcion: string;
  clima: string;
}
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [EpocaVisitarService, HttpClient],
  selector: 'app-epoca-visitar',
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
  templateUrl: './epoca-visitar.component.html',
  styleUrl: './epoca-visitar.component.css'
})
export class EpocaVisitarComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  epocaVisitars: EpocaVisitar[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  epocaToDelete: EpocaVisitar | null = null;
  epocaEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private epocaVisitarService: EpocaVisitarService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarEpoca();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar EPOCA
  openUpdateModal(epoca: EpocaVisitar): void {
    const dialogRef = this.dialog.open(EditarEpocaVisitarComponent, {
      width: '400px',
      data: {epocaVisitar: epoca}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'La Epoca se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar La Epoca .', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarEpoca() {
    // Lógica para cargar los datos de la base de datos.
    this.epocaVisitarService.recuperarTodosEpocaVisitar().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.epocaVisitars = data.map(epoca => {
          return {
            id: epoca.id,
            nombre: epoca.nombre,
            descripcion: epoca.descripcion,
            clima: epoca.clima,
          };
        });
        this.totalPages = Math.ceil(this.epocaVisitars.length / this.itemsPerPage);

        console.log("Datos de la Epoca cargados correctamente:", this.epocaVisitars);
      },
      error => {
        console.error('Error al cargar la Epoca:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Epoca');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'nombre', width: 30},
      {header: 'Descripción', key: 'descripcion', width: 15},
      {header: 'clima', key: 'clima', width: 15},
    ];
    this.epocaVisitars.forEach(epoca => {
      worksheet.addRow(epoca);
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
      this.epocaVisitars.sort((a, b) => {
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
  onEliminarEpoca(epoca: EpocaVisitar) {
    this.epocaToDelete = epoca;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.epocaToDelete) {
      const tipoId = this.epocaToDelete.id;
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
          this.epocaVisitarService.eliminarEpocaVisitar(tipoId).subscribe(() => {
            this.epocaVisitars = this.epocaVisitars.filter(p => p.id !== tipoId);
            this.epocaToDelete = null;
            this.epocaEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.epocaEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
              Swal.fire('¡Eliminado!', 'La Epoca ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar La Epoca:', error);
            this.errorMessage = 'Hubo un error al eliminar La Epoca. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar La Epoca.', 'error');
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

  onNuevoEpoca() {
    this.router.navigate(['/nueva-epoca']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
