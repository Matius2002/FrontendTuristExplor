import { Injectable } from '@angular/core';
import {entornos} from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";

interface  Rol {
  id: number;
  rolName: string;
}

interface Permisos {
  id: number;
  name: string;

}
@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  constructor(private http: HttpClient) {

  }

  //nuevo permiso

  // Recuperar todos permiso

  // Eliminar permiso


  //obtener permiso id

  // Actualizar permiso

  // recuperar roles


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
