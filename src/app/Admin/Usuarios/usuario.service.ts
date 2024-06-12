import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

interface Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}

interface Usuarios {
  id: number;
  nombreUsuario: string;
  email: string;
  password: string;
  fechaRegistro: Date;
  rol: Rol;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private loggedIn: boolean = false;
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  constructor(private http: HttpClient) {}

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.loggedIn = false;
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Usuarios | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Function para guardar un nuevo Usuario
  guardarUsuario(tipoAlojamiento: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(`${this.baseUrl}/usuarios/guardarUsuarios`, tipoAlojamiento)
      .pipe(catchError(this.handleError));
  }

  // Eliminar Usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Recuperar todos Usuario
  recuperarTodosUsuario(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.baseUrl}/usuarios/obtenerTodosLosUsuario`)
      .pipe(catchError(this.handleError));
  }

  // Obtener Usuario
  obtenerUsuario(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.baseUrl}/usuarios/recuperarPorId/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar Usuario
  actualizarUsuario(id: number, tipoActualizada: Usuarios): Observable<Usuarios> {
    tipoActualizada.id = id;
    return this.http.put<Usuarios>(`${this.baseUrl}/usuarios/${id}`, tipoActualizada)
      .pipe(catchError(this.handleError));
  }

  // Verificar Usuario ya existe en la base de datos
  verificarUsuarioExistente(nombreUsuario: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/existe/${encodeURIComponent(nombreUsuario)}`)
      .pipe(catchError(this.handleError));
  }

  verificarUsuarioPorEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/userExiste/${encodeURIComponent(email)}`)
      .pipe(catchError(this.handleError));
  }

  // Recuperar Roles
  recuperarTodosRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/obtenerTodosLasRoles`)
      .pipe(catchError(this.handleError));
  }

  // Login
  login(credentials: { email: string, password: string }): Observable<Usuarios> {
    return this.http.post<Usuarios>(`${this.baseUrl}/usuarios/login`, credentials)
      .pipe(
        map((user: Usuarios) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }),
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
