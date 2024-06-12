import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {DestinoService} from "../destino.service";
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import {EditarDestinoComponent} from "../editar-destino/editar-destino.component";
import {FilterPipe} from "../../../FilterPipe";
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
  ruta: string;
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
  horaCreacion: string;
  fechaActualizacion: Date;
  horaActualizacion: string;


}
interface Item {
  id: number;
  destinoName: string;
}
@Component({
  providers: [DestinoService,HttpClient],
  selector: 'app-destinos',
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
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.css'
})
export class DestinosComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  destino!: Destinos;
  destinos: Destinos [] = [];
  tiposTurismo: TipoTurismo [] = [];
  atracionesPrincipales: AtracionesPrincipales [] = [];
  epocasVisitar: EpocasVisitar [] = [];
  imagenes: Images [] = [];


  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // destinos Eliminar
  showAlert: boolean = false;
  destinosToDelete: Destinos | null = null;
  destinosEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private destinoService: DestinoService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarDestinos();
    this.cargarTipoTurismos();
  }
  //Imprimir
  printTable() {
    window.print();
  }

  // Actualizar destino
  openUpdateModal(destinos: Destinos): void {
    const dialogRef = this.dialog.open(EditarDestinoComponent, {
      width: '400px',
      data: {destinos}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Destino se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar el Destino.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarDestinos() {
    // Lógica para cargar los datos de la base de datos.
    this.destinoService.recuperarTodosDestinos().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.destinos = data.map(destino => {
          return {
            id: destino.id,
            destinoName: destino.destinoName,
            descripcion: destino.descripcion,
            ubicacion: destino.ubicacion,
            tipoTurismo: destino.tipoTurismo,
            atracionesPrincipales: destino.atracionesPrincipales,
            epocasVisitar: destino.epocasVisitar,
            imagenes: destino.imagenes,
            fechaCreacion: destino.fechaCreacion,
            horaCreacion: destino.horaCreacion,
            fechaActualizacion:destino.fechaActualizacion,
            horaActualizacion:destino.horaActualizacion,

          };
        });
        this.totalPages = Math.ceil(this.destinos.length / this.itemsPerPage);

        console.log("Datos de los tipos de Destinos cargados correctamente:", this.destinos);
      },
      error => {
        console.error('Error al cargar los Destinos:', error);
      }
    );
  }
  cargarTipoTurismos() {
    // Lógica para cargar los datos de la base de datos.
    this.destinoService.recuperarTodosTiposTurismo().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        this.tiposTurismo = data.map(tipoTurismo => {
          return {
            id: tipoTurismo.id,
            nombre: tipoTurismo.nombre,

          };
        });
        this.totalPages = Math.ceil(this.tiposTurismo.length / this.itemsPerPage);
        console.log("Datos tipos de turismo cargados correctamente:", this.tiposTurismo);
      },
      error => {
        console.error('Error al cargar los tipos de turismo:', error);
      }
    );
  }
  //Excel
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Destinos');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'destinoName', width: 30},
      {header: 'Descripcion', key: 'descripcion', width: 30},
      {header: 'Ubicacion', key: 'ubicacion', width: 30},
      {header: 'TipoTurismo', key: 'tipoTurismo', width: 30},
      {header: 'atracionesPrincipales', key: 'atracionesPrincipales', width: 30},
      {header: 'epocasVisitar', key: 'epocasVisitar', width: 30},
      {header: 'imagenes', key: 'imagenes', width: 30},
      {header: 'fechaCreacion', key: 'fechaCreacion', width: 30},
      {header: 'fechaActualizacion', key: 'fechaActualizacion', width: 30},
      {header: 'horaActualizacion', key: 'horaActualizacion', width: 30},
      {header: 'noticias', key: 'noticias', width: 30},
    ];
    this.destinos.forEach(destino => {
      worksheet.addRow(destino);
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
      this.destinos.sort((a, b) => {
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
  onEliminarDestino(destinos: Destinos) {
    this.destinosToDelete = destinos;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.destinosToDelete) {
      const destinoId = this.destinosToDelete.id;
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
          this.destinoService.eliminarDestinos(destinoId).subscribe(() => {
            this.destinos = this.destinos.filter(p => p.id !== destinoId);
            this.destinosToDelete = null;
            this.destinosEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.destinosEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Destino ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Destino:', error);
            this.errorMessage = 'Hubo un error al eliminar El Destino. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Destino.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { destinoName: string; }) => {
        const itemText = item.destinoName.toLowerCase();
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

  onNuevoDestino() {
    this.router.navigate(['/nuevo-destinos']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
