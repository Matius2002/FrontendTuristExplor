import {Component, HostListener} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-volver-arriba',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './volver-arriba.component.html',
  styleUrl: './volver-arriba.component.css'
})
export class VolverArribaComponent {
  windowScrolled: boolean;

  constructor() {
    this.windowScrolled = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

}
