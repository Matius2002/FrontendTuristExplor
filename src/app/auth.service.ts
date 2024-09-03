import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private loggedIn = false; // Estado inicial de autenticación

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    // Verifica si existe un token en el localStorage
    return !!localStorage.getItem('authToken');
  }

  // Método para iniciar sesión
  login(token: string): void {
    // Guarda el token de autenticación en el localStorage
    localStorage.setItem('authToken', token);
  }

  // Método para cerrar sesión
  logout(): void {
    //this.loggedIn = false;
    // Elimina el token del localStorage al cerrar sesión
    localStorage.removeItem('authToken');
  }
}