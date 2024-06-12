import {Component, OnInit} from '@angular/core';
import {RolesService} from "../roles.service";
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
import {EditarRolesComponent} from "../editar-roles/editar-roles.component";

interface  Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}
interface Item {
  id: number;
  rolName: string;
}
@Component({
  providers: [RolesService, HttpClient],
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  roles: Rol[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // Eliminar
  showAlert: boolean = false;
  rolToDelete: Rol | null = null;
  rolEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private rolesService: RolesService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarRoles();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar alojamiento
  openUpdateModal(rol: Rol): void {
    const dialogRef = this.dialog.open(EditarRolesComponent, {
      width: '400px',
      data: {rol}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Rol se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar El Rol.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarRoles() {
    // Lógica para cargar los datos de la base de datos.
    this.rolesService.recuperarTodosRol().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.roles = data.map(rol => {
          return {
            id: rol.id,
            rolName: rol.rolName,
            rolDescripc: rol.rolDescripc,
            rolFechaCreac: rol.rolFechaCreac,
            rolFechaModic: rol.rolFechaModic,
          };
        });
        this.totalPages = Math.ceil(this.roles.length / this.itemsPerPage);

        console.log("Datos del Rol cargados correctamente:", this.roles);
      },
      error => {
        console.error('Error al cargar los Roles:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Roles');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Rol Name', key: 'rolName', width: 30},
      {header: 'Rol Descripc', key: 'rolDescripc', width: 15},
      {header: 'Rol FechaCreac', key: 'rolFechaCreac', width: 15},
      {header: 'Rol FechaModic', key: 'rolFechaModic', width: 15},

    ];
    this.roles.forEach(rol => {
      worksheet.addRow(rol);
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
      this.roles.sort((a, b) => {
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
  onEliminarRol(tipoAlojamiento: Rol) {
    this.rolToDelete = tipoAlojamiento;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.rolToDelete) {
      const tipoId = this.rolToDelete.id;
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
          this.rolesService.eliminarRol(tipoId).subscribe(() => {
            this.roles = this.roles.filter(p => p.id !== tipoId);
            this.rolToDelete = null;
            this.rolEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.rolEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Rol ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Rol:', error);
            this.errorMessage = 'Hubo un error al eliminar El Rol. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Rol.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { rolName: string; }) => {
        const itemText = item.rolName.toLowerCase();
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

  onNuevoRol() {
    this.router.navigate(['/nuevo-rol']);
  }

  navigateToo(route: string) {
    this.router.navigate([`/${route}`]);

  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
