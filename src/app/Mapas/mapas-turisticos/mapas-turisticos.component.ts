// Importaciones necesarias desde Angular, Leaflet y otros módulos
import { Component, OnInit } from '@angular/core'; // Importa la clase Component y el ciclo de vida OnInit
import * as L from 'leaflet'; // Importa toda la librería Leaflet, utilizada para manejar mapas interactivos
import { TouristSite } from "../../modelos/TouristSite"; // Importa el modelo TouristSite que define la estructura de un sitio turístico
import { TouristSiteService } from "../tourist-site.service"; // Servicio que maneja la obtención de datos de sitios turísticos
import { HttpClient, HttpClientModule } from "@angular/common/http"; // Módulo y cliente HTTP para manejar solicitudes

// Decorador del componente que define la configuración del mismo
@Component({
  providers: [TouristSiteService, HttpClient], // Proveedores de servicios necesarios para el componente
  selector: 'app-mapas-turisticos', // Selector utilizado para insertar este componente en la aplicación
  standalone: true, // Indica que el componente es independiente
  imports: [
    HttpClientModule, // Importa el módulo HTTP para realizar solicitudes dentro del componente
  ],
  templateUrl: './mapas-turisticos.component.html', // Ruta del archivo de plantilla HTML para este componente
  styleUrl: './mapas-turisticos.component.css' // Ruta del archivo CSS para los estilos de este componente
})
export class MapasTuristicosComponent implements OnInit { // Define la clase `MapasTuristicosComponent` que implementa `OnInit`
  // Constructor que inyecta el servicio `TouristSiteService`
  constructor(private siteService: TouristSiteService) {}

  // Método del ciclo de vida `ngOnInit` que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Inicializa un mapa de Leaflet centrado en una coordenada específica ([51.505, -0.09]) con un nivel de zoom 13
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Añade una capa de mapa con tiles desde OpenStreetMap y se atribuye la fuente
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Llama al servicio para obtener todos los sitios turísticos y añade marcadores al mapa para cada uno
    this.siteService.getAllSites().subscribe((sites: TouristSite[]) => {
      // Itera sobre cada sitio turístico obtenido del servicio
      sites.forEach(site => {
        // Crea un marcador en el mapa con las coordenadas del sitio (latitude y longitude)
        const marker = L.marker([site.latitude, site.longitude]).addTo(map);
        // Añade un popup al marcador con información sobre el sitio, incluyendo título, contenido y tipo de turismo
        marker.bindPopup(`<b>${site.title}</b><br>${site.content}<br>Tipo de Turismo: ${site.tourismType}`).openPopup();
      });
    });
  }
}
