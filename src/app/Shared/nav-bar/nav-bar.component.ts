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

  //Método para salir
  logout(): void {
    this.usuarioService.logout();
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      timer: 1000,
      timerProgressBar: true, 
      showConfirmButton: false, 
      allowOutsideClick: false,
      allowEscapeKey: false,
    willClose: () => {
      this.router.navigate(['/login']);
    }});
  }
  //Fin del método
}