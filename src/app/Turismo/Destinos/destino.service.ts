import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface TipoTurismo{
  id: number;
  nombre: string;
}
interface AtracionesPrincipales{
  id: number;
  nombre: string;
}
interface EpocasVisitar{
  id: number;
  nombre: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}

interface Destinos {
  id: number;
  destinoName: string;
  descripcion: string;
  ubicacion: string;
  tipoTurismo: TipoTurismo[];
  atracionesPrincipales: AtracionesPrincipales [];
  epocasVisitar: EpocasVisitar [];
  imagenes: Images [];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
@Injectable({
  providedIn: 'root'
})
export class DestinoService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API
  constructor(private http: HttpClient) { }


  // Function para guardar un nuevo destino
  guardarDestinos(destinos: Destinos): Observable<Destinos> {
    return this.http.post<Destinos>(`${this.baseUrl}/destinos/guardarDestinos`, destinos)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Eliminar Destinos
  eliminarDestinos(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/destinos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar si un destino ya existe en la base de datos
  verificarDestinosExistente(destinoName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/destinos/existe/${encodeURIComponent(destinoName)}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Recuperar todos Destinos
  recuperarTodosDestinos(): Observable<Destinos[]> {
    return this.http.get<Destinos[]>(`${this.baseUrl}/destinos/obtenerTodosLosDestinos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener Destinos
  obtenerDestinos(id: number): Observable<Destinos> {
    return this.http.get<Destinos>(`${this.baseUrl}/destinos/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Actualizar Destinos
  actualizarDestinos(id: number, tipoActualizada: Destinos): Observable<Destinos> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Destinos>(`${this.baseUrl}/destinos/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos TipoTurismo
  recuperarTodosTiposTurismo(): Observable<TipoTurismo[]> {
    return this.http.get<TipoTurismo[]>(`${this.baseUrl}/tipoturismos/obtenerTodosLosTiposTurismos`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Recuperar todos AtracionesPrincipales
  recuperarAtracionesPrincipales(): Observable<AtracionesPrincipales[]> {
    return this.http.get<AtracionesPrincipales[]>(`${this.baseUrl}/atracionesPrincipales/obtenerTodosLasAtraciones`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Recuperar todos EpocasVisitar
  recuperarEpocasVisitar(): Observable<EpocasVisitar[]> {
    return this.http.get<EpocasVisitar[]>(`${this.baseUrl}/epocaVisitars/obtenerTodosLosEpocaVisitar`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Recuperar todos Images
  recuperarImages(): Observable<Images[]> {
    return this.http.get<Images[]>(`${this.baseUrl}/images/obtenerTodosLosImages`)
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
