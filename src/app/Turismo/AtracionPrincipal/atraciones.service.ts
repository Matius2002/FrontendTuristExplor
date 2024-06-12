import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface Atraciones{
  id: number;
  nombre: string;
  descripcion: string;
  horarioFuncionamiento: string;
  horarioFin: string;
}
@Injectable({
  providedIn: 'root'
})
export class AtracionesService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo Atraciones
  guardarAtraciones(tipoAlojamiento: Atraciones): Observable<Atraciones> {
    return this.http.post<Atraciones>(`${this.baseUrl}/atracionesPrincipales/guardarAtracionPrincipal`, tipoAlojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar Atraciones
  eliminarAtraciones(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/atracionesPrincipales/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos Atraciones
  recuperarTodosAtraciones(): Observable<Atraciones[]> {
    return this.http.get<Atraciones[]>(`${this.baseUrl}/atracionesPrincipales/obtenerTodosLasAtraciones`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener Atraciones
  obtenerAtraciones(id: number): Observable<Atraciones> {
    return this.http.get<Atraciones>(`${this.baseUrl}/atracionesPrincipales/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Atraciones
  actualizarAtraciones(id: number, tipoActualizada: Atraciones): Observable<Atraciones> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Atraciones>(`${this.baseUrl}/atracionesPrincipales/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar Atraciones ya existe en la base de datos
  verificarAtracionesExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/atracionesPrincipales/existe/${encodeURIComponent(nombre)}`)
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
