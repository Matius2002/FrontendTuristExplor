import { Component, OnDestroy, OnInit } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../Admin/Usuarios/usuario.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  providers: [HttpClient,UsuarioService],
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private loginSub: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
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
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  logout(): void {
    this.usuarioService.logout();
    Swal.fire({icon: 'info',title: 'Sesión cerrada',text: 'Has cerrado sesión exitosamente. Serás redirigido en un momento.',timer: 3000,timerProgressBar: true,showConfirmButton: false, position: 'center',allowOutsideClick: false,allowEscapeKey: false,customClass: {popup: 'swal-custom-popup',title: 'swal-custom-title'
    },willClose: () => {
      this.router.navigate(['/login']);
    }});
  }
  
}
