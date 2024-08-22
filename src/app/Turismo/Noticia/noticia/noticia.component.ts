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
import {NoticiaService} from "../noticia.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import * as ExcelJS from "exceljs";
import {EditarNoticiaComponent} from "../editar-noticia/editar-noticia.component";
import Swal from "sweetalert2";

interface TipoTurismo {
  id: number;
  nombre: string;
}
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  fuente: string;
  images: Images[];
  tipoTurismo: TipoTurismo;
}

interface Item {
  id: number;
  titulo: string;
}
@Component({
  providers: [NoticiaService, HttpClient],
  selector: 'app-noticia',
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
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})
export class NoticiaComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  noticias: Noticia[] = [];
  tipoTurismos: TipoTurismo [] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  noticiaToDelete: Noticia | null = null;
  noticiaEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private noticiaService: NoticiaService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.cargarNoticias();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar alojamiento
  openUpdateModal(noticias: Noticia): void {
    const dialogRef = this.dialog.open(EditarNoticiaComponent, {
      width: '400px',
      data: {noticias}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'La Noticia se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar La Noticia.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarNoticias() {
    // Lógica para cargar los datos de la base de datos.
    this.noticiaService.recuperarTodosNoticia().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.noticias = data.map(noticia => {
          return {
            id: noticia.id,
            titulo: noticia.titulo,
            contenido: noticia.contenido,
            fechaPublicacion: noticia.fechaPublicacion,
            fuente: noticia.fuente,
            images: noticia.images,
            tipoTurismo: noticia.tipoTurismo

          };
        });
        this.totalPages = Math.ceil(this.noticias.length / this.itemsPerPage);

        console.log("Datos de la Noticia cargados correctamente:", this.noticias);
      },
      error => {
        console.error('Error al cargar las Noticias:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Noticias');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'titulo', key: 'titulo', width: 30},
      {header: 'contenido', key: 'contenido', width: 30},
      {header: 'fuente', key: 'fuente', width: 15},
      {header: 'imagenes', key: 'imagenes', width: 15},
      {header: 'tipoTurismos', key: 'tipoTurismos', width: 15},

    ];
    this.noticias.forEach(noticia => {
      worksheet.addRow(noticia);
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
      this.noticias.sort((a, b) => {
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
  onEliminarNoticia(noticia: Noticia) {
    this.noticiaToDelete = noticia;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.noticiaToDelete) {
      const tipoId = this.noticiaToDelete.id;
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
          this.noticiaService.eliminarNoticia(tipoId).subscribe(() => {
            this.noticias = this.noticias.filter(p => p.id !== tipoId);
            this.noticiaToDelete = null;
            this.noticiaEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.noticiaEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'La Noticia ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar La Noticia:', error);
            this.errorMessage = 'Hubo un error al eliminar La Noticia . Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar La Noticia.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { titulo: string; }) => {
        const itemText = item.titulo.toLowerCase();
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
    this.router.navigate(['/nueva-noticia']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
