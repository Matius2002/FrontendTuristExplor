// Importaciones necesarias desde Angular y otros módulos
import { Injectable } from "@angular/core"; // Decorador para servicios inyectables
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router"; // Interfaces y tipos para la navegación y protección de rutas
import { Observable } from "rxjs"; // Manejo de observables en Angular
import { VisitService } from "../Reportes/visit-service.service"; // Servicio para manejar el registro de visitas

// Decorador `Injectable` que indica que esta clase se puede inyectar como un servicio
@Injectable({
  providedIn: 'root' // Proporciona el guard a toda la aplicación desde la raíz
})
export class VisitGuard implements CanActivate { // Implementa la interfaz `CanActivate` para controlar el acceso a rutas
  // Constructor que inyecta el servicio `VisitService`
  constructor(private visitService: VisitService) {}

  // Método `canActivate` que determina si una ruta puede ser activada
  canActivate(
    next: ActivatedRouteSnapshot, // Información sobre la ruta que se intenta activar
    state: RouterStateSnapshot // Estado del router en el momento de la solicitud
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Registra la visita utilizando el servicio `VisitService` y la URL de la ruta solicitada
    this.visitService.registerVisit(state.url).subscribe(
      response => {
        console.log('Visita registrada:', response); // Log de éxito si la visita se registra correctamente
      },
      error => {
        console.error('Error al registrar la visita:', error); // Log de error si ocurre un problema al registrar la visita
      }
    );
    return true; // Permite la activación de la ruta siempre, independientemente del resultado de la suscripción
  }
}
