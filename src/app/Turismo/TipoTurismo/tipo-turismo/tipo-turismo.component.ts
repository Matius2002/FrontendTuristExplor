import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TipoTurismoService} from "../tipo-turismo.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import Swal from "sweetalert2";
import {EditarTipoTurismoComponent} from "../editar-tipo-turismo/editar-tipo-turismo.component";
import {FilterPipe} from "../../../FilterPipe";
import * as ExcelJS from 'exceljs';
import {CommonModule, DecimalPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCell, MatCellDef} from "@angular/material/table";
import {FormsModule} from "@angular/forms";
import {TooltipDirective} from "../../../../tooltip.directive";
import {NgxPaginationModule} from "ngx-pagination";
import {Router} from "@angular/router";


interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [HttpClient, TipoTurismoService],
  selector: 'app-tipo-turismo',
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
  ],
  templateUrl: './tipo-turismo.component.html',
  styleUrl: './tipo-turismo.component.css'
})
export class TipoTurismoComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  tipoTurismos: TipoTurismo[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  tipoToDelete: TipoTurismo | null = null;
  tipoEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private tipoTurismoService: TipoTurismoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarTipo();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar torre
  openUpdateModal(tipoTurismo: TipoTurismo): void {
    const dialogRef = this.dialog.open(EditarTipoTurismoComponent, {
      width: '400px',
      data: {tipoTurismo}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Tipo de Turismo se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar El Tipo de Turismo.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarTipo() {
    // Lógica para cargar los datos de la base de datos.
    this.tipoTurismoService.recuperarTodosTipos().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.tipoTurismos = data.map(tipoTurismo => {
          return {
            id: tipoTurismo.id,
            nombre: tipoTurismo.nombre,
            descripcion: tipoTurismo.descripcion,
            popularidad: tipoTurismo.popularidad
          };
        });
        this.totalPages = Math.ceil(this.tipoTurismos.length / this.itemsPerPage);

        console.log("Datos de los tipos de turismos cargados correctamente:", this.tipoTurismos);
      },
      error => {
        console.error('Error al cargar los tipos de turismos:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TipoTurismo');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'nombre', width: 30},
      {header: 'Descripción', key: 'descripcion', width: 15},
      {header: 'Popularidad', key: 'popularidad', width: 15}
    ];
    this.tipoTurismos.forEach(tipoTurismo => {
      worksheet.addRow(tipoTurismo);
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
      this.tipoTurismos.sort((a, b) => {
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
  onEliminarTipo(tipoTurismo: TipoTurismo) {
    this.tipoToDelete = tipoTurismo;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.tipoToDelete) {
      const tipoId = this.tipoToDelete.id;
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
          this.tipoTurismoService.eliminarTipo(tipoId).subscribe(() => {
            this.tipoTurismos = this.tipoTurismos.filter(p => p.id !== tipoId);
            this.tipoToDelete = null;
            this.tipoEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.tipoEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Tipo de Turismo ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Tipo de Turismo :', error);
            this.errorMessage = 'Hubo un error al eliminar El Tipo de Turismo . Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Tipo de Turismo .', 'error');
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
    this.router.navigate(['/nuevo-tipoTurismo']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
