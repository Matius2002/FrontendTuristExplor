import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  logout(): void {
    console.log("Sesión cerrada");
    this.router.navigate(['/login']);
  }
  
}
