import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar-topbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar-topbar.component.html',
  styleUrl: './navbar-topbar.component.css'
})
export class NavbarTopbarComponent {

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<NavbarTopbarComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {}
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
