import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // El servicio se proporciona en la raíz de la aplicación, lo que permite su acceso global
})
export class AuthService {
  // Variable privada que mantiene el estado de autenticación del usuario
  private loggedIn = false; 

  // Método que verifica si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.loggedIn; // Devuelve true si el usuario está autenticado, false en caso contrario
  }

  // Método para iniciar sesión, cambiando el estado de autenticación a verdadero
  login(): void {
    this.loggedIn = true; // Marca al usuario como autenticado
  }

  // Método para cerrar sesión, cambiando el estado de autenticación a falso
  logout(): void {
    this.loggedIn = false; // Marca al usuario como no autenticado
  }
}