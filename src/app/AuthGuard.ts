import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from "./Admin/Usuarios/usuario.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UsuarioService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
