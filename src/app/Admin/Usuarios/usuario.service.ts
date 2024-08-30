//Importaciones
import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { Usuario } from "./modelos/Usuario";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

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
  private expirationTime: number = 0;
  private _usuarioLogeado: Usuario = new Usuario();
  private _token: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  setToken(token: string, expirationTime: number): void {
    localStorage.setItem('jwtToken', token);
    this.expirationTime = expirationTime;
    this.isLoggedInSubject.next(true);
  }

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (localStorage.getItem('token') != null && this._token == null) {
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Usuarios | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      // Obtener el payload del token JWT
      const payload = this.obtenerPayload(token);
      // Extraer la información del usuario del payload
      return {
        id: payload.id,
        nombreUsuario: payload.username,
        email: payload.correo,
        password: '', // No es seguro almacenar contraseñas aquí
        fechaRegistro: new Date(), // Ajusta este campo según lo que obtienes del token
        rol: payload.rol // Ajusta según lo que tienes en el payload
      };
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }

  // Método para decodificar el payload de un token JWT
  obtenerPayload(token: string): any {
    try {
      // Dividir el token y decodificar el payload (segunda parte)
      const payload = token.split(".")[1];
      // Decodificar la parte base64 y parsearla como JSON
      return JSON.parse(atob(payload));
    } catch (e) {
      throw new Error('No se pudo decodificar el payload del token.');
    }
  }

  // Método para obtener la URL del informe
  getReportUrl(reportType: string, format: string): Observable<string> {
    const url = `${this.baseUrl}/reportes/${reportType}?format=${format}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  renewToken(): Observable<{ token: string, expirationTime: number }> {
    return this.http.post<{ token: string, expirationTime: number }>('/renew-token', {});
  }

  public get usuarioLogeado(): Usuario {
    if (this._usuarioLogeado != null) {
      return this._usuarioLogeado;

    } else if (localStorage.getItem('usuario') != null && this._usuarioLogeado == null) {
      let usuarioStorage: string | null = localStorage.getItem('usuario');
      if (usuarioStorage == null) {
        return new Usuario();
      }
      this._usuarioLogeado = JSON.parse(usuarioStorage) as Usuario;
      return this._usuarioLogeado;
    }
    return new Usuario();

  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authToken'); 
    this.isLoggedInSubject.next(false); 
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }   

  // Function para guardar un nuevo Usuario
  guardarUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(`${this.baseUrl}/usuarios/guardarUsuario`, usuario)
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
  login(credentials: { email: string, password: string }): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: httpHeaders })
      .pipe(
        tap(response => {
          const { token, expirationTime } = response;
          this.setToken(token, expirationTime);
          // Aquí puedes emitir un valor para actualizar el estado de `isLoggedIn` en el componente
          this.isLoggedInSubject.next(true);
        }),
        catchError(e => {
          return this.handleError(e);
        })
      );
    }    

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }


  // Función para manejar errores de HTTP
  private handleError(e: HttpErrorResponse): Observable<any> {
    if (e.status === 400) {
      Swal.fire(e.error.titulo, e.error.detalle, 'error');
    }
    return throwError(e);
  }

  guardarUsuarioEnStorage(token: string): void {
    let payload = this.obtenerPayload(token);
    this._usuarioLogeado = new Usuario();
    this._usuarioLogeado.id = payload.id;
    this._usuarioLogeado.nombreUsuario = payload.username;
    this._usuarioLogeado.email = payload.correo;
    this._usuarioLogeado.permisos = payload.permisos;
    localStorage.setItem('usuario', JSON.stringify(this._usuarioLogeado));
  }

  guardarToken(token: string): void {
    this._token = token;
    localStorage.setItem('authToken', this._token); 
  }

  
}


