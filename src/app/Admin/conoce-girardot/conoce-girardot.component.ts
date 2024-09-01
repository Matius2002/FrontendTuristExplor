// Importaciones necesarias desde Angular y otros módulos
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { FormGroup, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ImagesService } from "../../Turismo/Images/images.service";
import { HttpClientModule } from "@angular/common/http";
import { FilterPipe } from "../../FilterPipe";

// Definición de la interfaz que describe la estructura de una imagen
interface Images {
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

// Decorador del componente que define su configuración
@Component({
  providers: [ImagesService], // Proveedor del servicio de imágenes
  selector: 'app-conoce-girardot', // Selector del componente
  templateUrl: './conoce-girardot.component.html', // Ruta de la plantilla HTML
  standalone: true, // El componente es independiente
  imports: [
    NgIf,
    NgForOf,
    HttpClientModule,
    NgOptimizedImage,
    DatePipe,
    CurrencyPipe,
    FilterPipe,
    FormsModule,
    NgClass,
  ],
  styleUrls: ['./conoce-girardot.component.css'] // Ruta del archivo de estilos
})
export class ConoceGirardotComponent implements OnInit {
  crearForm!: FormGroup; // Formulario Reactivo
  imagenes: Images[] = []; // Arreglo para almacenar las imágenes recuperadas
  isModalOpen: boolean = false; // Controla la visibilidad del modal
  selectedImage: any = null; // Imagen seleccionada para mostrar en el modal

  // Método para obtener la URL completa de una imagen
  getImageUrl(imagePath: string): string {
    const url = `http://localhost:8080/api${imagePath}`; // Construye la URL base del servidor
    console.log(`Imagen con URL: ${url}`); // Muestra la URL en la consola para depuración
    return url; // Devuelve la URL completa
  }

  // Constructor del componente, inyecta el servicio de imágenes y el enrutador
  constructor(
    private imagesService: ImagesService, // Servicio para manejar las imágenes
    private router: Router, // Enrutador para la navegación entre rutas
  ) { }

  // Método para abrir el modal con la imagen seleccionada
  openModal(imagen: any) {
    console.log('Selected Image:', imagen); // Muestra la imagen seleccionada en la consola
    this.selectedImage = imagen; // Asigna la imagen seleccionada
    this.isModalOpen = true; // Abre el modal
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false; // Cierra el modal
    this.selectedImage = null; // Limpia la imagen seleccionada
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarImagenes(); // Carga las imágenes al iniciar
  }

  // Método para recuperar todas las imágenes desde el servicio
  cargarImagenes() {
    this.imagesService.recuperarTodosImages().subscribe(
      (data: Images[]) => { // Suscribe al observable que devuelve las imágenes
        this.imagenes = data; // Asigna las imágenes al arreglo
        this.filtrarImagenesParaCarrusel(); // Filtra las imágenes para el carrusel
      }
    );
  }

  // Método para filtrar las imágenes que se mostrarán en el carrusel
  filtrarImagenesParaCarrusel() {
    const nombresRequeridos = [ // Lista de rutas de las imágenes requeridas
      '/imagenes/TurismoCulturalCarusel1.jpg',
      '/imagenes/TurismoCulturalCarusel2.jpg',
      '/imagenes/TurismoCulturalCarusel3.jpg',
      '/imagenes/TurismoCulturalCarusel4.jpg',
      '/imagenes/TurismoCulturalCarusel5.jpg',
      '/imagenes/TurismoCulturalCarusel6.jpg'
    ];
    this.imagenes = this.imagenes.filter(imagen => // Filtra las imágenes según las rutas especificadas
      nombresRequeridos.includes(imagen.ruta)
    );
  }

  // Maneja el error al cargar una imagen
  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event); // Muestra un mensaje de error en la consola
  }
}
