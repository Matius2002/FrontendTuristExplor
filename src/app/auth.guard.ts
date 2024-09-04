// Importaciones necesarias para configurar el guardián de autenticación
import { inject } from '@angular/core'; // Importa `inject` para inyectar servicios de Angular en funciones
import { CanActivateFn, Router } from '@angular/router'; // Importa `CanActivateFn` para definir un guardián y `Router` para la navegación
import { AuthService } from './auth.service'; // Importa el servicio de autenticación para manejar el estado del usuario

// Definición del guardián de autenticación `authGuard` usando `CanActivateFn`
export const authGuard: CanActivateFn = (route, state) => {
  // Inyecta el servicio de autenticación `AuthService` para verificar si el usuario está autenticado
  const authService = inject(AuthService);
  // Inyecta el `Router` para permitir la navegación en caso de redirección
  const router = inject(Router);

  // Verifica si el usuario está autenticado utilizando el método `isLoggedIn` del `AuthService`
  if (authService.isLoggedIn()) {
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  } else {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    // Se agrega `queryParams` para enviar la URL actual y redirigir al usuario después de iniciar sesión
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Niega el acceso a la ruta si el usuario no está autenticado
  }
};
