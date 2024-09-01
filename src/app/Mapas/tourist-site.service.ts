// Importaciones necesarias desde Angular y otros módulos
import { Injectable } from '@angular/core'; // Decorador para servicios inyectables
import { TouristSite } from "../modelos/TouristSite"; // Importa el modelo TouristSite que define la estructura de un sitio turístico
import { Observable } from "rxjs"; // Importa Observable para manejar las respuestas asincrónicas de las solicitudes HTTP
import { HttpClient } from "@angular/common/http"; // Cliente HTTP para realizar solicitudes al backend

// Decorador `Injectable` que indica que esta clase se puede inyectar como un servicio
@Injectable({
  providedIn: 'root' // Proporciona el servicio a toda la aplicación desde la raíz
})
export class TouristSiteService { // Define la clase `TouristSiteService`
  // URL base del API para interactuar con los sitios turísticos
  private apiUrl = 'http://localhost:8080/api/tourist-sites';

  // Constructor que inyecta el cliente HTTP para hacer peticiones al servidor
  constructor(private http: HttpClient) { }

  // Método para obtener todos los sitios turísticos desde el API
  getAllSites(): Observable<TouristSite[]> {
    // Realiza una solicitud GET al API y devuelve un observable con una lista de sitios turísticos
    return this.http.get<TouristSite[]>(this.apiUrl);
  }

  // Método para crear un nuevo sitio turístico
  createSite(site: TouristSite): Observable<TouristSite> {
    // Realiza una solicitud POST al API para crear un nuevo sitio y devuelve un observable con el sitio creado
    return this.http.post<TouristSite>(this.apiUrl, site);
  }
}
