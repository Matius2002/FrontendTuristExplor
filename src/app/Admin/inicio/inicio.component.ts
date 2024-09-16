// Importaciones necesarias desde Angular, servicios y otros módulos
import { Component, OnInit } from '@angular/core'; // Importa `Component` y `OnInit` para definir el componente y su ciclo de vida
import { FormBuilder } from "@angular/forms"; // Importa `FormBuilder` para crear formularios reactivos
import { Router } from "@angular/router"; // Importa `Router` para la navegación entre rutas
import { NgClass, NgForOf, NgIf } from "@angular/common"; // Importa directivas comunes de Angular
import { ExperienciaService } from "../../Turismo/Experiencia/experiencia.service"; // Servicio para manejar experiencias
import { HttpClientModule } from "@angular/common/http"; // Módulo HTTP para manejar solicitudes
import { UsuarioService } from "../Usuarios/usuario.service"; // Servicio para manejar usuarios
import { NoticiaService } from "../../Turismo/Noticia/noticia.service"; // Servicio para manejar noticias
import { interval, Subscription } from "rxjs"; // Importa `interval` para crear intervalos de tiempo y `Subscription` para manejar observables

// Interfaces para definir las estructuras de datos utilizadas
interface Usuario {
  id: number;
  nombreUsuario?: string;
  email?: string;
}

interface Destinos {
  id: number;
  destinoName?: string;
}

interface Experiencia {
  id: number;
  calificacion: string;
  comentario: string;
  fecha: string;
  usuario: Usuario;
  destino: Destinos;
}

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

// Decorador del componente que define la configuración del mismo
@Component({
  providers: [ExperienciaService, UsuarioService, NoticiaService], // Proveedores de servicios para el componente
  selector: 'app-inicio', // Selector del componente
  standalone: true, // Indica que el componente es independiente
  imports: [NgIf, HttpClientModule, NgForOf, NgClass], // Importaciones de módulos y directivas
  templateUrl: './inicio.component.html', // Ruta al archivo HTML de la plantilla
  styleUrl: './inicio.component.css' // Ruta al archivo CSS de estilos
})
export class InicioComponent implements OnInit {
  experiencias!: Experiencia[]; // Arreglo para almacenar las experiencias cargadas
  usuarios: Usuario[] = []; // Arreglo para almacenar usuarios
  destinos: Destinos[] = []; // Arreglo para almacenar destinos

  noticiasChunks: Noticia[][] = []; // Arreglo para almacenar noticias divididas en grupos
  tipoTurismos: TipoTurismo[] = []; // Arreglo para almacenar tipos de turismo
  imagenes: Images[] = []; // Arreglo para almacenar imágenes

  isModalOpen: boolean = false; // Controla la visibilidad del modal
  selectedImage: any = null; // Imagen seleccionada para mostrar en el modal
  private subscription: Subscription = new Subscription(); // Subscripción para manejar observables

  // Constructor del componente, inyecta servicios y otras dependencias
  constructor(
    private formBuilder: FormBuilder, // Inyecta FormBuilder para manejar formularios reactivos
    private usuarioService: UsuarioService, // Inyecta el servicio de usuarios
    private experienciaService: ExperienciaService, // Inyecta el servicio de experiencias
    private noticiaService: NoticiaService, // Inyecta el servicio de noticias
    private router: Router // Inyecta el servicio de enrutamiento para navegar entre rutas
  ) {}

  // Navega a una ruta específica basada en el parámetro proporcionado
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]); // Navega a la ruta especificada
  }

  // Abre el modal para mostrar una imagen seleccionada
  openModal(imagen: any) {
    console.log('Selected Image:', imagen); // Muestra la imagen seleccionada en la consola
    this.selectedImage = imagen; // Asigna la imagen seleccionada
    this.isModalOpen = true; // Abre el modal
  }

  // Cierra el modal
  closeModal() {
    this.isModalOpen = false; // Cierra el modal
    this.selectedImage = null; // Limpia la imagen seleccionada
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarExperiencias(); // Carga las experiencias al iniciar
    this.cargarNoticias(); // Carga las noticias al iniciar
    // Cambia las noticias automáticamente cada 5 segundos (5000 ms)
    this.subscription.add(interval(5000).subscribe(() => {
      this.rotateNews(); // Función para rotar las noticias visibles
    }));
  }

  // Método que se ejecuta al destruir el componente, limpia las subscripciones
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Desuscribirse para evitar fugas de memoria
  }

  // Carga todas las experiencias desde el servicio
  cargarExperiencias() {
    this.experienciaService.recuperarTodosExperiencia().subscribe(
      (data: Experiencia[]) => {
        this.experiencias = data; // Asigna las experiencias al arreglo
      },
      (error) => {
        console.error('Error al cargar las experiencias', error); // Muestra el error en la consola
      }
    );
  }

  // Carga todas las noticias desde el servicio
  cargarNoticias() {
    this.noticiaService.recuperarTodosNoticia().subscribe(
      (data: Noticia[]) => {
        console.log('Noticias cargadas:', data); // Muestra las noticias cargadas en la consola
        // Agrupa noticias en chunks de tamaño 3
        this.noticiasChunks = this.chunkArray(data, 3);
        console.log('Chunks de noticias:', this.noticiasChunks); // Muestra los grupos de noticias
      },
      (error) => {
        console.error('Error al cargar las Noticias', error); // Muestra el error en la consola
      }
    );
  }

  // Función para dividir un array en grupos de tamaño especificado
  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }

  // Función para rotar las noticias visibles, moviendo el primer grupo al final
  rotateNews() {
    if (this.noticiasChunks.length > 1) {
      const firstGroup = this.noticiasChunks.shift(); // Extrae el primer grupo
      if (firstGroup) {
        this.noticiasChunks.push(firstGroup); // Añade el primer grupo al final
      }
    }
  }

  // Maneja el error al cargar una imagen, muestra un mensaje en la consola
  onImageError(event: ErrorEvent, ruta: string | undefined) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event); // Muestra un mensaje de error en la consola
  }

  // Obtiene la URL completa de una imagen, basada en su ruta
  getImageUrl(imagePath: string | undefined): string {
    const url = `http://localhost:8080/api${imagePath}`; // Construye la URL base del servidor
    console.log(`Imagen con URL: ${url}`); //Muestra la URL en la consola para depuración
    return url; // Devuelve la URL completa
  }

  // Navega a la ruta de detalles de una noticia específica
  verDetalleNoticia(noticia: Noticia) {
    this.router.navigate(['/noticias', noticia.id], { state: { noticia } }); // Navega con la noticia en el estado
  }

  // Formatea una fecha a una cadena legible
  formatDate(dateString: Date): string {
    return new Date(dateString).toLocaleDateString(); // Convierte la fecha a un formato de cadena legible
  }
}
