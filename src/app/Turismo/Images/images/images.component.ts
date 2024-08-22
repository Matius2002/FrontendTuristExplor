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
import {ImagesService} from "../images.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {EditarImagesComponent} from "../editar-images/editar-images.component";
import * as ExcelJS from "exceljs";
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Item {
  id: number;
  nombre: string;
}
@Component({
  providers: [ImagesService, HttpClient],
  selector: 'app-images',
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
  templateUrl: './images.component.html',
  styleUrl: './images.component.css'
})
export class ImagesComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  images: Images[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  imagesToDelete: Images | null = null;
  imagesEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;
  constructor(
    private imagesService: ImagesService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarImages();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar torre
  openUpdateModal(imagenes: Images): void {
    const dialogRef = this.dialog.open(EditarImagesComponent, {
      width: '400px',
      data: {imagenes}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'las Imagenes se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar las Imagenes.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarImages() {
    // Lógica para cargar los datos de la base de datos.
    this.imagesService.recuperarTodosImages().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.images = data.map(image => {
          return {
            id: image.id,
            nombre: image.nombre,
            ruta: image.ruta,
            activa: image.activa

          };
        });
        this.totalPages = Math.ceil(this.images.length / this.itemsPerPage);

        console.log("Datos de los tipos de Alojamiento cargados correctamente:", this.images);
      },
      error => {
        console.error('Error al cargar los tipos de Alojamiento:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('imagenes');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre', key: 'nombre', width: 30},
      {header: 'imageData', key: 'imageData', width: 50},


    ];
    this.images.forEach(image => {
      worksheet.addRow(image);
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
      this.images.sort((a, b) => {
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
  onEliminarImagen(image: Images) {
    this.imagesToDelete = image;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.imagesToDelete) {
      const tipoId = this.imagesToDelete.id;
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
          this.imagesService.eliminarImages(tipoId).subscribe(() => {
            this.images = this.images.filter(p => p.id !== tipoId);
            this.imagesToDelete = null;
            this.imagesEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.imagesEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'La Imagen ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar La Imagen  :', error);
            this.errorMessage = 'Hubo un error al eliminar La Imagen  . Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminarLa Imagen.', 'error');
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

  onNuevoImagen() {
    this.router.navigate(['/nueva-imagen']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
