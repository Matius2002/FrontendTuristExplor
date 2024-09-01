// Importaciones necesarias desde Angular y otros módulos
import { Component, HostListener } from '@angular/core'; // Importa Component y HostListener para manejar eventos del DOM
import { NgIf } from "@angular/common"; // Importa NgIf para mostrar o esconder elementos condicionalmente

// Decorador del componente que define la configuración del mismo
@Component({
  selector: 'app-volver-arriba', // Selector utilizado para insertar este componente en la aplicación
  standalone: true, // Indica que el componente es independiente
  imports: [
    NgIf // Importa la directiva NgIf para usarla dentro del componente
  ],
  templateUrl: './volver-arriba.component.html', // Ruta del archivo de plantilla HTML para este componente
  styleUrl: './volver-arriba.component.css' // Ruta del archivo CSS para los estilos de este componente
})
export class VolverArribaComponent { // Define la clase `VolverArribaComponent`
  windowScrolled: boolean; // Propiedad para determinar si la ventana ha hecho scroll hacia abajo

  // Constructor del componente, inicializa `windowScrolled` en falso
  constructor() {
    this.windowScrolled = false;
  }

  // Escucha el evento de scroll en la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica si el desplazamiento de la página supera los 100 píxeles
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true; // Marca `windowScrolled` como verdadero para mostrar el botón
    } 
    // Si la ventana ha hecho scroll y se encuentra casi en la parte superior (< 10 píxeles), oculta el botón
    else if (this.windowScrolled && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < 10) {
      this.windowScrolled = false; // Marca `windowScrolled` como falso para ocultar el botón
    }
  }

  // Función que desplaza suavemente la ventana hacia la parte superior de la página
  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; // Obtiene la posición actual del scroll
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll); // Solicita una nueva animación de cuadro
        window.scrollTo(0, currentScroll - (currentScroll / 8)); // Reduce el desplazamiento en una fracción para un efecto suave
      }
    })();
  }
}
