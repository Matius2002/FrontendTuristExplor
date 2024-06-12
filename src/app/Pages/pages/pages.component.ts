import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../../Shared/footer/footer.component";
import {BreadcrumbsComponent} from "../../Shared/breadcrumbs/breadcrumbs.component";
import {RouterOutlet} from "@angular/router";
import {NavBarComponent} from "../../Shared/nav-bar/nav-bar.component";
import {NavbarTopbarComponent} from "../../Shared/navbar-topbar/navbar-topbar.component";
import {VolverArribaComponent} from "../../otros/volver-arriba/volver-arriba.component";

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    FooterComponent,
    BreadcrumbsComponent,
    RouterOutlet,
    NavBarComponent,
    NavbarTopbarComponent,
    VolverArribaComponent
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit{
  navbarHeight: number = 0;
  footerHeight: number = 0;

  ngOnInit(): void {
    // Obtiene el navbar y el footer
    const navbar = document.querySelector('app-navbar-topbar') as HTMLElement;
    const footer = document.querySelector('app-footer') as HTMLElement;

    // Verifica si se encontraron los elementos
    if (navbar !== null) {
      this.navbarHeight = navbar.offsetHeight || 0; // Si offsetHeight es null, establece la altura en 0
    }

    if (footer !== null) {
      this.footerHeight = footer.offsetHeight || 0; // Si offsetHeight es null, establece la altura en 0
    }
  }

}
