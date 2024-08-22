import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface TipoAlojamiento{
  id: number;
  nombre: string;
  descripcion: string;
  servicios: string;
  precioPromedio: string;
}
@Injectable({
  providedIn: 'root'
})
export class TipoAlojamientoService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }

  // Function para guardar un nuevo TipoAlojamiento
  guardarTipoAlojamiento(tipoAlojamiento: TipoAlojamiento): Observable<TipoAlojamiento> {
    return this.http.post<TipoAlojamiento>(`${this.baseUrl}/tipoAlojamientos/guardarTipoAlojamientos`, tipoAlojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar TipoAlojamiento
  eliminarTipoAlojamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tipoAlojamientos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos TipoAlojamiento
  recuperarTodosTiposAlojamineto(): Observable<TipoAlojamiento[]> {
    return this.http.get<TipoAlojamiento[]>(`${this.baseUrl}/tipoAlojamientos/obtenerTodosLosTiposAlojamientos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener TipoAlojamiento
  obtenerTipoAlojamiento(id: number): Observable<TipoAlojamiento> {
    return this.http.get<TipoAlojamiento>(`${this.baseUrl}/tipoAlojamientos/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar TipoAlojamiento
  actualizarTipoAlojamiento(id: number, tipoActualizada: TipoAlojamiento): Observable<TipoAlojamiento> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<TipoAlojamiento>(`${this.baseUrl}/tipoAlojamientos/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar TipoAlojamiento ya existe en la base de datos
  verificarTipoExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/tipoAlojamientos/existe/${encodeURIComponent(nombre)}`)
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
