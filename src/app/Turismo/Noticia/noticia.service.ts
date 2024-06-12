import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
interface TipoTurismo {
  id: number;
  nombre: string;
}
interface Images{
  id: number;
  nombre: string;
  ruta: string;
  activa: boolean;
}
interface Noticias {
  id: number;
  titulo: string;
  contenido: string
  fechaPublicacion: Date;
  fuente: string;
  imagenes: Images[];
  tipoTurismos: TipoTurismo [];

}
@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  // URL BASE API
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;  //Url Base API

  constructor(private http: HttpClient) {

  }
  // Function para guardar un nuevo Noticia
  guardarNoticia(noticia: Noticias): Observable<Noticias> {
    return this.http.post<Noticias>(`${this.baseUrl}/noticias/guardarNoticias`, noticia)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar Noticia
  eliminarNoticia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/noticias/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todos Noticia
  recuperarTodosNoticia(): Observable<Noticias[]> {
    return this.http.get<Noticias[]>(`${this.baseUrl}/noticias/obtenerTodosLosNoticias`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtener Noticia
  obtenerNoticia(id: number): Observable<Noticias> {
    return this.http.get<Noticias>(`${this.baseUrl}/noticias/recuperarPorId/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar Noticia
  actualizarNoticia(id: number, tipoActualizada: Noticias): Observable<Noticias> {
    // Asegúrate de que el ID en el cuerpo de la solicitud sea igual al ID en la URL
    tipoActualizada.id = id;
    return this.http.put<Noticias>(`${this.baseUrl}/noticias/${id}`, tipoActualizada)
      .pipe(
        catchError(this.handleError)
      );
  }
  // verificar Noticia ya existe en la base de datos
  verificarNoticiaExistente(titulo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/noticias/existe/${encodeURIComponent(titulo)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Recuperar todas las Imagenes
  recuperarTodosImages(): Observable<Images[]> {
    return this.http.get<Images[]>(`${this.baseUrl}/images/obtenerTodosLosImages`)
      .pipe(
        catchError(this.handleError)
      );
  }
  //recuperar tipos de turismo
  recuperarTodosTipos(): Observable<TipoTurismo[]>{
    return this.http.get<TipoTurismo[]>(`${this.baseUrl}/tipoturismos/obtenerTodosLosTiposTurismos`)
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
