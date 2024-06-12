import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule, DecimalPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCell, MatCellDef} from "@angular/material/table";
import {FormsModule} from "@angular/forms";
import {TooltipDirective} from "../../../../tooltip.directive";
import {NgxPaginationModule} from "ngx-pagination";
import {FilterPipe} from "../../../FilterPipe";
import {ExperienciaService} from "../experiencia.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import * as ExcelJS from "exceljs";
import {EditarExperienciaComponent} from "../editar-experiencia/editar-experiencia.component";

interface Usuario {
  id: number;
  nombreUsuario: string;

}
interface Destinos {
  id: number;
  destinoName: string;

}
interface Experiencia {
  id: number;
  calificacion: string;
  comentario: string;
  fecha: string;
  usuario: Usuario;
  destinos: Destinos;
}
interface Item {
  id: number;
  comentario: string;
}
@Component({
  providers: [ExperienciaService, HttpClient],
  selector: 'app-experiencia',
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
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.css'
})
export class ExperienciaComponent implements OnInit {
  experiencias: Experiencia[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // Eliminar
  showAlert: boolean = false;
  experienciaToDelete: Experiencia | null = null;
  experienciaEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private experienciaService: ExperienciaService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarExperiencias();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar experiencia
  openUpdateModal(experiencia: Experiencia): void {
    const dialogRef = this.dialog.open(EditarExperienciaComponent, {
      width: '400px',
      data: {experiencia}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'La Experiencia se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar La Experiencia.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarExperiencias() {
    // Lógica para cargar los datos de la base de datos.
    this.experienciaService.recuperarTodosExperiencia().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.experiencias = data.map(experiencia => {
          return {
            id: experiencia.id,
            calificacion: experiencia.calificacion,
            comentario: experiencia.comentario,
            fecha: experiencia.fecha,
            usuario: experiencia.usuario,
            destinos: experiencia.destinos
          };
        });
        this.totalPages = Math.ceil(this.experiencias.length / this.itemsPerPage);

        console.log("Datos de experienciao cargados correctamente:", this.experiencias);
      },
      error => {
        console.error('Error al cargar las experiencia:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('experiencia');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Calificacion', key: 'calificacion', width: 30},
      {header: 'Comentario', key: 'comentario', width: 15},
      {header: 'Fecha', key: 'fecha', width: 15},
      {header: 'Usuario', key: 'usuario', width: 15},
      {header: 'Destinos', key: 'destinos', width: 15},

    ];
    this.experiencias.forEach(experiencia => {
      worksheet.addRow(experiencia);
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
      this.experiencias.sort((a, b) => {
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
  onEliminarExperiencia(tipoAlojamiento: Experiencia) {
    this.experienciaToDelete = tipoAlojamiento;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.experienciaToDelete) {
      const tipoId = this.experienciaToDelete.id;
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
          this.experienciaService.eliminarExperiencia(tipoId).subscribe(() => {
            this.experiencias = this.experiencias.filter(p => p.id !== tipoId);
            this.experienciaToDelete = null;
            this.experienciaEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.experienciaEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'La Experiencia ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar La Experiencia:', error);
            this.errorMessage = 'Hubo un error al eliminar La Experiencia. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar La Experiencia.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { comentario: string; }) => {
        const itemText = item.comentario.toLowerCase();
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

  onNuevoExperiencia() {
    this.router.navigate(['/nueva-experiencia']);
  }


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
