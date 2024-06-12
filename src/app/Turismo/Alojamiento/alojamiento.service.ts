import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
interface Destinos {
  id: number;
  destinoName: string;
}
interface  TipoAlojamiento{
  id: number;
  nombre: string;
}
interface Alojamiento{
  id: number;
  destinos: Destinos;
  nombre: string;
  descripcion: string;
  tipoAlojamiento: TipoAlojamiento;
  direccion: string;
  celular: string;
  email: string;
  webUrl: string;
  precioGeneral: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;

}
@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo Alojamiento
  guardarAlojamiento(alojamiento: Alojamiento): Observable<Alojamiento> {
    return this.http.post<Alojamiento>(`${this.baseUrl}/alojamientos/guardarAlojamientos`, alojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar Alojamiento
  eliminarAlojamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/alojamientos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos Alojamiento
  recuperarTodosAlojamiento(): Observable<Alojamiento[]> {
    return this.http.get<Alojamiento[]>(`${this.baseUrl}/alojamientos/obtenerTodosLosAlojamientos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener TipoTurismo
  obtenerAlojamiento(id: number): Observable<Alojamiento> {
    return this.http.get<Alojamiento>(`${this.baseUrl}/alojamientos/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Alojamiento
  actualizarAlojamiento(id: number, tipoActualizada: Alojamiento): Observable<Alojamiento> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Alojamiento>(`${this.baseUrl}/alojamientos/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar Alojamiento ya existe en la base de datos
  verificarAlojamientoExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/alojamientos/existe/${encodeURIComponent(nombre)}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //recuperar tipos de turismo
  recuperarTodosTiposAlojamiento(): Observable<TipoAlojamiento[]>{
    return this.http.get<TipoAlojamiento[]>(`${this.baseUrl}/tipoAlojamientos/obtenerTodosLosTiposAlojamientos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  recuperarTodosDestinos(): Observable<Destinos[]>{
    return this.http.get<Destinos[]>(`${this.baseUrl}/destinos/obtenerTodosLosDestinos`)
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
