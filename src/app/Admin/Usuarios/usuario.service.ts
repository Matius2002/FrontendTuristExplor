import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { Usuario } from "./modelos/Usuario";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { AuthService } from '../../auth.service';

// Definición de interfaces para roles y usuarios
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
  // Variables y propiedades para gestionar la autenticación y el usuario actual
  private loggedIn: boolean = false;
  dynamicHost = entornos.dynamicHost; // Dirección dinámica del host desde la configuración de entornos
  private baseUrl: string = `http://${this.dynamicHost}/api`; // URL base para las llamadas a la API
  private expirationTime: number = 0; // Tiempo de expiración del token
  private _usuarioLogeado: Usuario = new Usuario(); // Usuario actualmente logueado
  private _token: string | null = null; // Token de autenticación
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Observable para gestionar el estado de autenticación
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable expuesto para suscribirse al estado de autenticación

  constructor(
    private http: HttpClient, // Servicio HttpClient para realizar peticiones HTTP
    private authService: AuthService, // Servicio Router para navegación dentro de la aplicación
    private router: Router
  ) { }

  // Guarda el token y actualiza el estado de autenticación
  setToken(token: string, expirationTime: number): void {
    localStorage.setItem('authToken', token);
    this.expirationTime = expirationTime;
    this.isLoggedInSubject.next(true);
  }

  // Devuelve el token almacenado
  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (localStorage.getItem('token') != null && this._token == null) {
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  // Obtiene el usuario actual decodificando el token
  getCurrentUser(): Usuarios | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      const payload = this.obtenerPayload(token); // Decodifica el payload del token
      return {
        id: payload.id,
        nombreUsuario: payload.username,
        email: payload.correo,
        password: '', 
        fechaRegistro: new Date(), 
        rol: payload.rol 
      };
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }
  
  // Decodifica el payload de un token JWT
  obtenerPayload(token: string): any {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload)); // Decodifica la parte base64 del token
    } catch (e) {
      throw new Error('No se pudo decodificar el payload del token.');
    }
  }

  // Genera la URL para descargar reportes basándose en el tipo de reporte y formato
  getReportUrl(reportType: string, format: string): Observable<string> {
    const url = `${this.baseUrl}/reportes/${reportType}?format=${format}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para renovar el token de autenticación
  renewToken(): Observable<{ token: string, expirationTime: number }> {
    return this.http.post<{ token: string, expirationTime: number }>('/renew-token', {});
  }

  // Devuelve el usuario logueado desde el almacenamiento local
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

  // Verifica si hay un token guardado, lo que indica que el usuario está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Cierra sesión del usuario, eliminando el token y redirigiendo al login
  logout(): void {
    this.authService.logout(); // Llama a AuthService para cerrar sesión
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

  // Guarda un nuevo usuario a través de una solicitud HTTP POST a la API
  guardarUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(`${this.baseUrl}/usuarios/guardarUsuario`, usuario)
      .pipe(catchError(this.handleError));
  }

  // Elimina un usuario específico por ID
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Recupera todos los usuarios registrados desde la API
  recuperarTodosUsuario(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.baseUrl}/usuarios/obtenerTodosLosUsuario`)
      .pipe(catchError(this.handleError));
  }

  // Obtiene un usuario específico por su ID
  obtenerUsuario(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.baseUrl}/usuarios/recuperarPorId/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualiza un usuario existente mediante una solicitud PUT
  actualizarUsuario(id: number, tipoActualizada: Usuarios): Observable<Usuarios> {
    tipoActualizada.id = id;
    return this.http.put<Usuarios>(`${this.baseUrl}/usuarios/${id}`, tipoActualizada)
      .pipe(catchError(this.handleError));
  }

  // Verifica si un nombre de usuario ya existe en la base de datos
  verificarUsuarioExistente(nombreUsuario: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/existe/${encodeURIComponent(nombreUsuario)}`)
      .pipe(catchError(this.handleError));
  }

  // Verifica si un correo electrónico ya está registrado
  verificarUsuarioPorEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/userExiste/${encodeURIComponent(email)}`)
      .pipe(catchError(this.handleError));
  }

  // Recupera todos los roles disponibles desde la API
  recuperarTodosRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/obtenerTodosLasRoles`)
      .pipe(catchError(this.handleError));
  }

  // Método para iniciar sesión
  login(credentials: { email: string, password: string }): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: httpHeaders })
      .pipe(
        tap(response => {
          const token = response.token; // Asegúrate de que el backend devuelva un token en la respuesta
          this.authService.login(token); // Guarda el token usando AuthService
        }),
        catchError(e => {
          Swal.fire('Error', 'Error al iniciar sesión', 'error');
          return throwError(e);
        })
      );
  }     

  // Verifica si existe un token en el almacenamiento local
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Maneja los errores HTTP y muestra alertas al usuario
  private handleError(e: HttpErrorResponse): Observable<any> {
    if (e.status === 400) {
      Swal.fire(e.error.titulo, e.error.detalle, 'error');
    }
    return throwError(e);
  }

  // Guarda la información del usuario logueado en el almacenamiento local
  guardarUsuarioEnStorage(token: string): void {
    let payload = this.obtenerPayload(token);
    this._usuarioLogeado = new Usuario();
    this._usuarioLogeado.id = payload.id;
    this._usuarioLogeado.nombreUsuario = payload.username;
    this._usuarioLogeado.email = payload.correo;
    this._usuarioLogeado.permisos = payload.permisos;
    localStorage.setItem('usuario', JSON.stringify(this._usuarioLogeado));
  }

  // Guarda el token de autenticación en el almacenamiento local
  guardarToken(token: string): void {
    this._token = token;
    localStorage.setItem('authToken', this._token); 
  }
}