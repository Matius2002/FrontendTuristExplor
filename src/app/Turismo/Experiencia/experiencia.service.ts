import { Injectable } from '@angular/core'; 
import { entornos } from "../../Entorno/entornos"; 
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs"; 
import { UsuarioService } from '../../Admin/Usuarios/usuario.service'; 

interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string; 
}

interface Destinos {
  id: number;
  destinoName: string; 
}

interface Experiencia {
  id: number; 
  calificacion: string; 
  comentario: string;
  fecha: string; 
  usuario: {id: number};
  destinos: {id: number}; 
}


@Injectable({
  providedIn: 'root' 
})
export class ExperienciaService {
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  //Envía datos al back mediante una solicitud HTTP (POST)
  guardarExperiencia(experiencia: Experiencia): Observable<Experiencia> {
    console.log('Guardando experiencia (Servicio de experiencia): ',experiencia);
    const headers = new HttpHeaders({'Content-Type': 'application/json' });
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
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      if (error.error && typeof error.error === 'object') {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message || 'Mensaje no disponible'}`;
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.statusText || 'Mensaje no disponible'}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}