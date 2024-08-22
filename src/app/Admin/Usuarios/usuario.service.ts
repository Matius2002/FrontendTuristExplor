import { Injectable } from '@angular/core';
import { entornos } from "../../Entorno/entornos";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {Usuario} from "./modelos/Usuario";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

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

  private _usuarioLogeado:Usuario=new Usuario();
  private _token:string|null=null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,

  ) {

  }

  // Método para obtener la URL del informe
  getReportUrl(reportType: string, format: string): Observable<string> {
    const url = `${this.baseUrl}/reportes/${reportType}?format=${format}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }


  setToken(token: string, expirationTime: number): void {
    localStorage.setItem('jwtToken', token);
    this.expirationTime = expirationTime;
    //this.startExpirationTimer();
    this.isLoggedInSubject.next(true);
  }

  public get token():string|null{
    if (this._token != null) {
      return this._token;
    }else if (sessionStorage.getItem('token')!=null && this._token==null ) {
      this._token=sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  renewToken(): Observable<{ token: string, expirationTime: number }> {
    return this.http.post<{ token: string, expirationTime: number }>('/renew-token', {});
  }

  public get usuarioLogeado():Usuario{
    if (this._usuarioLogeado!=null) {
      return this._usuarioLogeado;

    }else if (sessionStorage.getItem('usuario')!=null && this._usuarioLogeado==null) {
      let usuarioStorage:string|null=sessionStorage.getItem('usuario');
      if (usuarioStorage==null) {
        return new Usuario();
      }
      this._usuarioLogeado=JSON.parse(usuarioStorage) as Usuario;
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
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false); // Actualizar el estado de autenticación
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Usuarios | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
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
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
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

  guardarUsuarioEnStorage(token:string):void{
    let payload=this.obtenerPayload(token);
    this._usuarioLogeado=new Usuario();
    this._usuarioLogeado.id=payload.id;
    this._usuarioLogeado.nombreUsuario=payload.username;
    this._usuarioLogeado.email=payload.correo;
    this._usuarioLogeado.permisos=payload.permisos;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuarioLogeado));
  }

  guardarToken(token:string):void{
    this._token=token;
    sessionStorage.setItem('token', this._token);
  }

  obtenerPayload(token:string):any{
    return JSON.parse(atob(token.split(".")[1]));
  }


}
