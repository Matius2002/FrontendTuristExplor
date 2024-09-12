// Importaciones necesarias para el servicio y manejo de peticiones HTTP
import { Injectable } from '@angular/core'; // Importa Injectable para definir un servicio en Angular
import { entornos } from "../../Entorno/entornos"; // Importa configuraciones de entornos, como URLs dinámicas
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"; // Importa herramientas para realizar peticiones HTTP y manejar errores
import { catchError, Observable, throwError } from "rxjs"; // Importa operadores de RxJS para manejar errores en observables
import Swal from 'sweetalert2'; // Librería para mostrar alertas y notificaciones
import { UsuarioService } from '../../Admin/Usuarios/usuario.service'; // Servicio para manejar la lógica de usuarios

// Definición de la interfaz Usuario para asegurar la estructura de los datos
interface Usuario {
  id: number; // Identificador único del usuario
  nombreUsuario: string; // Nombre del usuario
  email: string; // Correo electrónico del usuario
}

// Definición de la interfaz Destinos para manejar la estructura de los destinos
interface Destinos {
  id: number; // Identificador único del destino
  destinoName: string; // Nombre del destino
}

// Definición de la interfaz Experiencia para estructurar los datos de una experiencia
interface Experiencia {
  id: number; // Identificador único de la experiencia
  calificacion: string; // Calificación de la experiencia
  comentario: string; // Comentario sobre la experiencia
  fecha: string; // Fecha de registro de la experiencia
  usuario: Usuario; // Objeto Usuario asociado a la experiencia
  destinos: Destinos; // Objeto Destinos asociado a la experiencia
}

// Decorador Injectable para definir el servicio y su inyección en toda la aplicación
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class ExperienciaService {
  // URL BASE API
  dynamicHost = entornos.dynamicHost; // Asigna la URL del host dinámico según el entorno configurado
  private baseUrl: string = `http://${this.dynamicHost}/api`; // Define la URL base de la API, combinando el host dinámico y el path de la API

  // Constructor del servicio, inyectando HttpClient para realizar peticiones y UsuarioService para manejar usuarios
  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  // Método para guardar una nueva experiencia
  guardarExperiencia(experiencia: Experiencia): Observable<Experiencia> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Experiencia>(`${this.baseUrl}/experiencias/guardarExperiencia`, experiencia, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }  
  
  // Método para eliminar una experiencia por su ID
  eliminarExperiencia(id: number): Observable<void> {
    // Realiza una solicitud DELETE para eliminar una experiencia específica
    return this.http.delete<void>(`${this.baseUrl}/experiencias/${id}`)
      .pipe(
        catchError(this.handleError) // Maneja los errores de la solicitud usando una función personalizada
      );
  }

  // Método para recuperar todas las experiencias
  recuperarTodosExperiencia(): Observable<Experiencia[]> {
    // Realiza una solicitud GET para obtener todas las experiencias desde el backend
    return this.http.get<Experiencia[]>(`${this.baseUrl}/experiencias/obtenerTodosLosExperiencia`)
      .pipe(
        catchError(this.handleError) // Maneja los errores de la solicitud
      );
  }

  // Método para obtener una experiencia específica por su ID
  obtenerExperiencia(id: number): Observable<Experiencia> {
    // Realiza una solicitud GET para obtener una experiencia específica por ID
    return this.http.get<Experiencia>(`${this.baseUrl}/experiencias/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError) // Maneja los errores de la solicitud
      );
  }

  // Método para actualizar una experiencia existente
  actualizarExperiencia(id: number, tipoActualizada: Experiencia): Observable<Experiencia> {
    tipoActualizada.id = id; // Asegura que el ID de la experiencia coincida con el ID de la solicitud
    // Realiza una solicitud PUT para actualizar la experiencia con los nuevos datos
    return this.http.put<Experiencia>(`${this.baseUrl}/experiencias/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError) // Maneja los errores de la solicitud
      );
  }

  // Método para recuperar todos los destinos disponibles
  recuperarTodosDestinos(): Observable<Destinos[]> {
    // Realiza una solicitud GET para obtener todos los destinos
    return this.http.get<Destinos[]>(`${this.baseUrl}/destinos/obtenerTodosLosDestinos`)
      .pipe(
        catchError(this.handleError) // Maneja los errores de la solicitud
      );
  }

  // Método privado para manejar los errores de las solicitudes HTTP
  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Error desconocido'; // Mensaje de error predeterminado

    if (error.error instanceof ErrorEvent) {
      // Si el error es del lado del cliente (ej. problemas de red)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Si el error es del lado del servidor
      if (error.error && typeof error.error === 'object') {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message || 'Mensaje no disponible'}`;
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.statusText || 'Mensaje no disponible'}`;
      }
    }

    console.error(errorMessage); // Imprime el mensaje de error en la consola para depuración
    return throwError(errorMessage); // Devuelve un observable que lanza el error para ser manejado por los subscriptores
  }
}