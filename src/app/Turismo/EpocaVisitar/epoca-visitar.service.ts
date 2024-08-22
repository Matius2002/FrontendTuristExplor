import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface EpocaVisitar{
  id: number;
  nombre: string;
  descripcion: string;
  clima: string;
}
@Injectable({
  providedIn: 'root'
})
export class EpocaVisitarService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo EpocaVisitar
  guardarEpocaVisitar(tipoAlojamiento: EpocaVisitar): Observable<EpocaVisitar> {
    return this.http.post<EpocaVisitar>(`${this.baseUrl}/epocaVisitars/guardarEpocaVisitar`, tipoAlojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar EpocaVisitar
  eliminarEpocaVisitar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/epocaVisitars/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos EpocaVisitar
  recuperarTodosEpocaVisitar(): Observable<EpocaVisitar[]> {
    return this.http.get<EpocaVisitar[]>(`${this.baseUrl}/epocaVisitars/obtenerTodosLosEpocaVisitar`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener EpocaVisitar
  obtenerEpocaVisitar(id: number): Observable<EpocaVisitar> {
    return this.http.get<EpocaVisitar>(`${this.baseUrl}/epocaVisitars/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar EpocaVisitar
  actualizarEpocaVisitar(id: number, tipoActualizada: EpocaVisitar): Observable<EpocaVisitar> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<EpocaVisitar>(`${this.baseUrl}/epocaVisitars/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar EpocaVisitar ya existe en la base de datos
  verificarEpocaVisitarExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/epocaVisitars/existe/${encodeURIComponent(nombre)}`)
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
