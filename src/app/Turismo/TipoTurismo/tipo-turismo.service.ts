import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {entornos} from "../../Entorno/entornos";
import {catchError, Observable, throwError} from "rxjs";

interface TipoTurismo{
  id: number;
  nombre: string;
  descripcion: string;
  popularidad: string;
}
@Injectable({
  providedIn: 'root'
})
export class TipoTurismoService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo TipoTurismo
  guardarTipo(tipoTurismo: TipoTurismo): Observable<TipoTurismo> {
    return this.http.post<TipoTurismo>(`${this.baseUrl}/tipoturismos/guardarTipoTurismos`, tipoTurismo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar TipoTurismo
  eliminarTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tipoturismos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos TipoTurismo
  recuperarTodosTipos(): Observable<TipoTurismo[]> {
    return this.http.get<TipoTurismo[]>(`${this.baseUrl}/tipoturismos/obtenerTodosLosTiposTurismos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener TipoTurismo
  obtenerTipo(id: number): Observable<TipoTurismo> {
    return this.http.get<TipoTurismo>(`${this.baseUrl}/tipoturismos/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar TipoTurismo
  actualizarTipo(id: number, tipoActualizada: TipoTurismo): Observable<TipoTurismo> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<TipoTurismo>(`${this.baseUrl}/tipoturismos/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar TipoTurismo ya existe en la base de datos
  verificarTipoExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/tipoturismos/existe/${encodeURIComponent(nombre)}`)
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
