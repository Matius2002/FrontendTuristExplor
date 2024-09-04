// Importa `Injectable` para definir un servicio en Angular
import { Injectable } from '@angular/core';

// Decorador `Injectable` que configura el servicio para estar disponible en toda la aplicación
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible de forma global sin necesidad de declararlo en módulos
})
export class AuthService {
  // // Estado inicial de autenticación (opcional, no utilizado actualmente)
  // private loggedIn = false;

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    // Retorna `true` si existe un token en el localStorage, de lo contrario, retorna `false`
    // `!!` convierte el resultado a un valor booleano
    return !!localStorage.getItem('authToken');
  }

  // Método para iniciar sesión
  login(token: string): void {
    // Guarda el token de autenticación en el localStorage con la clave 'authToken'
    // Este token suele ser proporcionado por el backend después de una autenticación exitosa
    localStorage.setItem('authToken', token);
  }

  // Método para cerrar sesión
  logout(): void {
    // // Alternativa comentada para manejar el estado de inicio de sesión
    // this.loggedIn = false;
    // Elimina el token de autenticación del localStorage, lo que efectivamente cierra la sesión
    localStorage.removeItem('authToken');
  }
}
