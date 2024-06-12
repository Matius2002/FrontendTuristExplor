import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
interface Usuario {
  id: number;
  nombreUsuario: string;

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
  usuario: Usuario;
  destinos: Destinos;
}
@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar una nueva experiencia
  guardarExperiencia(tipoAlojamiento: Experiencia): Observable<Experiencia> {
    return this.http.post<Experiencia>(`${this.baseUrl}/experiencias/guardarExperiencia`, tipoAlojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar experiencias
  eliminarExperiencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/experiencias/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos experiencias
  recuperarTodosExperiencia(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(`${this.baseUrl}/experiencias/obtenerTodosLosExperiencia`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener experiencias
  obtenerExperiencia(id: number): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.baseUrl}/experiencias/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar experiencias
  actualizarExperiencia(id: number, tipoActualizada: Experiencia): Observable<Experiencia> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Experiencia>(`${this.baseUrl}/experiencias/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Función para manejar errores de HTTP
  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
