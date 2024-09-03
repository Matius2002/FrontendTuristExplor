import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Importa el servicio de autenticación

// Definición del guardián de autenticación, que se utiliza para proteger rutas
export const authGuard: CanActivateFn = (route, state) => {
  // Inyección del servicio AuthService, que gestiona la autenticación del usuario
  const authService = inject(AuthService); 

  // Inyección del Router para manejar la redirección de rutas
  const router = inject(Router); 

  // Verifica si el usuario está autenticado utilizando el método isLoggedIn del AuthService
  if (authService.isLoggedIn()) {
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  } else {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    // Se agrega el parámetro returnUrl para recordar la URL que el usuario intentaba acceder
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Niega el acceso a la ruta
  }
};