import {Component,OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormGroup, FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {ImagesService} from "../../Turismo/Images/images.service";
import {HttpClientModule} from "@angular/common/http";
import {FilterPipe} from "../../FilterPipe";

interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
@Component({
  providers: [ImagesService],
  selector: 'app-conoce-girardot',
  templateUrl: './conoce-girardot.component.html',
  standalone: true,
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
  styleUrls: ['./conoce-girardot.component.css']
})
export class ConoceGirardotComponent implements OnInit{
  crearForm!: FormGroup;
  imagenes: Images[]=[];
  isModalOpen: boolean = false;
  selectedImage: any = null;

  getImageUrl(imagePath: string): string {
    const url = `http://localhost:8080/api${imagePath}`;
    console.log(`Imagen con URL: ${url}`);
    return url;
  }
  constructor(
    private imagesService: ImagesService,
    private router: Router,
  ) {
  }

  // Método para abrir el modal
  openModal(imagen: any) {
    console.log('Selected Image:', imagen);
    this.selectedImage = imagen;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
  ngOnInit(): void {
    this.cargarImagenes();
  }
  cargarImagenes() {
    this.imagesService.recuperarTodosImages().subscribe(
      (data: Images[]) => {
      this.imagenes = data;
      this.filtrarImagenesParaCarrusel();
    });
  }

  filtrarImagenesParaCarrusel() {
    const nombresRequeridos = [
      '/imagenes/TurismoCulturalCarusel1.jpg',
      '/imagenes/TurismoCulturalCarusel2.jpg',
      '/imagenes/TurismoCulturalCarusel3.jpg',
      '/imagenes/TurismoCulturalCarusel4.jpg',
      '/imagenes/TurismoCulturalCarusel5.jpg',
      '/imagenes/TurismoCulturalCarusel6.jpg'
    ];
    this.imagenes = this.imagenes.filter(imagen =>
      nombresRequeridos.includes(imagen.ruta)
    );
  }

  onImageError(event: ErrorEvent, ruta: string) {
    console.error(`Error al cargar la imagen con ruta: ${ruta}`, event);
  }


}

