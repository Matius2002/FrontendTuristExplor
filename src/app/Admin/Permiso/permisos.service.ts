// Importaciones necesarias desde Angular y otros módulos
import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos"; // Importa configuraciones del entorno, como la URL base
import { HttpClient, HttpErrorResponse } from "@angular/common/http"; // Importaciones para manejar solicitudes HTTP y errores
import { Observable, throwError } from "rxjs"; // Manejo de observables y errores

// Definición de la interfaz `Rol` para representar un rol en el sistema
interface Rol {
  id: number; // Identificador único del rol
  rolName: string; // Nombre del rol
}

// Definición de la interfaz `Permisos` para representar los permisos en el sistema
interface Permisos {
  id: number; // Identificador único del permiso
  name: string; // Nombre del permiso
}

// Decorador `Injectable` que indica que esta clase se puede inyectar como un servicio
@Injectable({
  providedIn: 'root' // Proporciona el servicio a toda la aplicación desde la raíz
})
export class PermisosService {
  dynamicHost = entornos.dynamicHost; // Host dinámico obtenido de la configuración del entorno
  private baseUrl: string = `http://${this.dynamicHost}/api`; // URL base para las solicitudes HTTP

  // Constructor del servicio que inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Métodos (comentados) que se pueden implementar para manejar permisos y roles:
  // - nuevo permiso: Para crear un nuevo permiso
  // - Recuperar todos los permisos: Para obtener la lista de permisos
  // - Eliminar permiso: Para eliminar un permiso específico
  // - obtener permiso por id: Para obtener los detalles de un permiso específico por su ID
  // - Actualizar permiso: Para actualizar la información de un permiso existente
  // - recuperar roles: Para obtener la lista de roles disponibles

  // Función para manejar errores de HTTP
  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Error desconocido'; // Mensaje de error por defecto
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`; // Mensaje de error para errores de cliente
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message}`; // Mensaje detallado para errores de servidor
    }
    console.error(errorMessage); // Imprime el mensaje de error en la consola
    return throwError(errorMessage); // Retorna un observable con el mensaje de error
  }
}
