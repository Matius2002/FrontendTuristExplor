import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {UsuarioService} from "../../Admin/Usuarios/usuario.service";
import {NgIf} from "@angular/common";
import Swal from "sweetalert2";
import {Subscription} from "rxjs";

@Component({
  providers: [HttpClient, UsuarioService],
  selector: 'app-navbar-topbar',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
  ],
  templateUrl: './navbar-topbar.component.html',
  styleUrl: './navbar-topbar.component.css'
})
export class NavbarTopbarComponent implements OnInit, OnDestroy{
  isLoggedIn: boolean = false;
  private loginSub: Subscription | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loginSub = this.usuarioService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        console.log('isLoggedIn:', this.isLoggedIn); // Verifica el valor en la consola
      }
    );
  }


  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  logout(): void {
    this.usuarioService.logout();
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      // Redirigir al usuario después de cerrar sesión
      this.router.navigate(['/login']);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}

