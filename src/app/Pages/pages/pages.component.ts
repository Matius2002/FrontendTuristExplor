// Importaciones necesarias desde Angular y otros módulos
import { Component, OnInit } from '@angular/core'; // Importa Component y OnInit para la creación y ciclo de vida del componente
import { FooterComponent } from "../../Shared/footer/footer.component"; // Importa el componente del pie de página
import { BreadcrumbsComponent } from "../../Shared/breadcrumbs/breadcrumbs.component"; // Importa el componente de migas de pan
import { RouterOutlet } from "@angular/router"; // Importa RouterOutlet para la renderización de rutas
import { NavBarComponent } from "../../Shared/nav-bar/nav-bar.component"; // Importa el componente de la barra de navegación principal
import { NavbarTopbarComponent } from "../../Shared/navbar-topbar/navbar-topbar.component"; // Importa el componente de la barra de navegación superior
import { VolverArribaComponent } from "../../otros/volver-arriba/volver-arriba.component"; // Importa el componente para volver al inicio de la página

// Decorador del componente que define la configuración del mismo
@Component({
  selector: 'app-pages', // Selector utilizado para insertar este componente en la aplicación
  standalone: true, // Indica que el componente es independiente
  imports: [
    FooterComponent, // Componente del pie de página
    BreadcrumbsComponent, // Componente de migas de pan
    RouterOutlet, // Punto de renderización para el contenido dinámico de las rutas
    NavBarComponent, // Componente de la barra de navegación principal
    NavbarTopbarComponent, // Componente de la barra de navegación superior
    VolverArribaComponent // Componente para el botón de volver al inicio
  ],
  templateUrl: './pages.component.html', // Ruta del archivo de plantilla HTML para este componente
  styleUrl: './pages.component.css' // Ruta del archivo CSS para los estilos de este componente
})
export class PagesComponent implements OnInit { // Define la clase `PagesComponent` que implementa `OnInit`
  navbarHeight: number = 0; // Propiedad para almacenar la altura de la barra de navegación
  footerHeight: number = 0; // Propiedad para almacenar la altura del pie de página

  // Método del ciclo de vida `ngOnInit` que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Obtiene los elementos del DOM correspondientes a la barra de navegación superior y el pie de página
    const navbar = document.querySelector('app-navbar-topbar') as HTMLElement;
    const footer = document.querySelector('app-footer') as HTMLElement;

    // Verifica si se encontró la barra de navegación y obtiene su altura
    if (navbar !== null) {
      this.navbarHeight = navbar.offsetHeight || 0; // Si `offsetHeight` es null o undefined, establece la altura en 0
    }

    // Verifica si se encontró el pie de página y obtiene su altura
    if (footer !== null) {
      this.footerHeight = footer.offsetHeight || 0; // Si `offsetHeight` es null o undefined, establece la altura en 0
    }
  }
}
