import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
interface  Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  private getHeaders(): HttpHeaders {
    // Suponiendo que tienes el email almacenado de alguna manera, por ejemplo, en localStorage.
    const email = localStorage.getItem('userEmail');
    return new HttpHeaders({ 'email': email || '' });
  }

  // Function para guardar un nuevo Rol
  guardarRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.baseUrl}/roles/guardarRoles`, rol, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar Rol
  eliminarRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos los Roles
  recuperarTodosRol(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/obtenerTodosLasRoles`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener Rol por ID
  obtenerRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.baseUrl}/roles/recuperarPorId/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Rol
  actualizarRol(id: number, rolActualizada: Rol): Observable<Rol> {
    rolActualizada.id = id;
    return this.http.put<Rol>(`${this.baseUrl}/roles/${id}`, rolActualizada, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Verificar si un Rol ya existe en la base de datos
  verificarRolExistente(rolName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/roles/existe/${encodeURIComponent(rolName)}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Verificar si el usuario tiene el rol de 'administrador'
  verificarRolAdmin(email: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/check-admin-role/${encodeURIComponent(email)}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Función para manejar errores de HTTP
  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 403) {
      console.error('Acceso prohibido. No tienes permiso para acceder a este recurso.');
      return throwError('Acceso prohibido. No tienes permiso para acceder a este recurso.');
    } else {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
  }

}
