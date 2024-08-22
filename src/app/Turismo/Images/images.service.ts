import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  constructor(private http: HttpClient) {
  }

// Función para guardar una nueva imagen
  guardarImagenes(archivo: FormData): Observable<Images> {
    return this.http.post<Images>(`${this.baseUrl}/images/cargar`, archivo, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar TipoAlojamiento
  eliminarImages(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/images/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos Images
  recuperarTodosImages(): Observable<Images[]> {
    return this.http.get<Images[]>(`${this.baseUrl}/images/obtenerTodosLosImages`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener Images
  obtenerImages(id: number): Observable<Images> {
    return this.http.get<Images>(`${this.baseUrl}/images/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Images
  actualizarImages(id: number, formData: FormData): Observable<Images> {
    return this.http.put<Images>(`${this.baseUrl}/images/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // verificar Images ya existe en la base de datos
  verificarImagesExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/images/existe/${encodeURIComponent(nombre)}`)
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
