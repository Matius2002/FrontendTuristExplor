import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado utilizando el método isLoggedIn del AuthService
  if (authService.isLoggedIn()) {
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  } else {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Niega el acceso a la ruta
  }
};