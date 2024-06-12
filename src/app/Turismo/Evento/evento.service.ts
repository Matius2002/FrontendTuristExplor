import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

interface Destinos{
  id: number;
  destinoName: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Evento{
  id: number;
  destino: Destinos;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  costoEntrada: number;
  images: Images[];
}
@Injectable({
  providedIn: 'root'
})
export class EventoService {

  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo Evento
  guardarEvento(tipoAlojamiento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}/eventos/guardarEventos`, tipoAlojamiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar Evento
  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eventos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos Evento
  recuperarTodosEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos/obtenerTodosLosEvento`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener Evento
  obtenerEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/eventos/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Evento
  actualizarEvento(id: number, tipoActualizada: Evento): Observable<Evento> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Evento>(`${this.baseUrl}/eventos/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar Evento ya existe en la base de datos
  verificarEventoExistente(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/eventos/existe/${encodeURIComponent(nombre)}`)
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
