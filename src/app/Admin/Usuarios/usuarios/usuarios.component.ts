import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../usuario.service";
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
import {EditarUsuariosComponent} from "../editar-usuarios/editar-usuarios.component";
interface  Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}
interface Usuarios {
  id: number;
  nombreUsuario: string;
  email: string;
  password: string;
  fechaRegistro: Date;
  rol: Rol;
}
interface Item {
  id: number;
  nombreUsuario: string;
}
@Component({
  providers: [UsuarioService, HttpClient],
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  usuarios: Usuarios[] = [];
  page = 1; // Inicializa la página en 1
  itemsPerPage = 5; // Número de elementos por página
  totalPages = 0; // Número total de páginas
  currentColumn: string = 'id'; // Columna inicial para ordenar
  sortOrder: string = 'asc';

  // tipo Eliminar
  showAlert: boolean = false;
  usuariosToDelete: Usuarios | null = null;
  usuariosEliminado: boolean = false;
  errorMessage: string | null = null;

  //búsqueda
  searchText: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  searchNotFound: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }
  //Imprimir
  printTable() {
    window.print();
  }
  // Actualizar alojamiento
  openUpdateModal(usuario: Usuarios): void {
    const dialogRef = this.dialog.open(EditarUsuariosComponent, {
      width: '400px',
      data: {usuario}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        Swal.fire('¡Actualizado!', 'El Usuario se ha actualizado correctamente.', 'success');
      } else if (result === 'error') {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar El Usuario.', 'error');
      }
    });
  }
  protected readonly Math = Math;
  cargarUsuarios() {
    // Lógica para cargar los datos de la base de datos.
    this.usuarioService.recuperarTodosUsuario().subscribe(
      data => {
        console.log("Datos recibidos del servidor:", data);
        console.log("Cantidad de registros recibidos:", data.length);
        this.usuarios = data.map(usuario => {
          return {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            email: usuario.email,
            password: usuario.password,
            fechaRegistro: usuario.fechaRegistro,
            rol: usuario.rol,
          };
        });
        this.totalPages = Math.ceil(this.usuarios.length / this.itemsPerPage);

        console.log("Datos de los Usuarios cargados correctamente:", this.usuarios);
      },
      error => {
        console.error('Error al cargar los Usuarios:', error);
      }
    );
  }
  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');
    worksheet.columns = [
      {header: 'ID', key: 'id', width: 10},
      {header: 'Nombre Usuario', key: 'nombreUsuario', width: 30},
      {header: 'Email', key: 'email', width: 15},
      {header: 'Password', key: 'password', width: 15},
      {header: 'Fecha Registro', key: 'fechaRegistro', width: 15},
      {header: 'Rol', key: 'rol', width: 15},

    ];
    this.usuarios.forEach(usuario => {
      worksheet.addRow(usuario);
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
      this.usuarios.sort((a, b) => {
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
  onEliminarUsuario(tipoAlojamiento: Usuarios) {
    this.usuariosToDelete = tipoAlojamiento;
    this.confirmDelete();
  }
  confirmDelete() {
    if (this.usuariosToDelete) {
      const tipoId = this.usuariosToDelete.id;
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
          this.usuarioService.eliminarUsuario(tipoId).subscribe(() => {
            this.usuarios = this.usuarios.filter(p => p.id !== tipoId);
            this.usuariosToDelete = null;
            this.usuariosEliminado = true; // Mostrar mensaje de eliminación correcta
            setTimeout(() => {
              this.usuariosEliminado = false; // Ocultar el mensaje después de cierto tiempo (por ejemplo, 3 segundos)
            }, 3000);
            Swal.fire('¡Eliminado!', 'El Usuario ha sido eliminado correctamente.', 'success');
          }, error => {
            console.error('Error al eliminar El Usuario :', error);
            this.errorMessage = 'Hubo un error al eliminar El Usuario. Por favor, inténtalo de nuevo más tarde.';
            setTimeout(() => {
              this.showAlert = false;
            }, 8000);
            Swal.fire('Error', 'Hubo un error al eliminar El Usuario.', 'error');
          });
        }
      });
    }
  }
  performSearch() {
    if (this.searchText.trim() !== '') {
      const searchKeywords = this.searchText.toLowerCase().split(' ').filter(Boolean);
      this.filteredItems = this.items.filter((item: { nombreUsuario: string; }) => {
        const itemText = item.nombreUsuario.toLowerCase();
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

  onNuevoUsers() {
    this.router.navigate(['/nuevo-usuario']);
  }


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
