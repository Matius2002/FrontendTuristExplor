import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

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
  usuario: Usuario;
  destino: Destinos;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  // Url Base API

  constructor(private http: HttpClient) {}

  // Function para guardar una nueva experiencia
  guardarExperiencia(experiencia: Experiencia): Observable<Experiencia> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Aquí puedes manejar el error en caso de que el token no esté disponible
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post<Experiencia>(`${this.baseUrl}/experiencias/guardarExperiencia`, experiencia, { headers })
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

  // Recuperar todas las experiencias
  recuperarTodosExperiencia(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(`${this.baseUrl}/experiencias/obtenerTodosLosExperiencia`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una experiencia por ID
  obtenerExperiencia(id: number): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.baseUrl}/experiencias/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar experiencias
  actualizarExperiencia(id: number, tipoActualizada: Experiencia): Observable<Experiencia> {
    return this.http.put<Experiencia>(`${this.baseUrl}/experiencias/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos los destinos
  recuperarTodosDestinos(): Observable<Destinos[]> {
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
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
