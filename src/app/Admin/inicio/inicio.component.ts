import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-inicio',
  standalone: true,
    imports: [
      NgIf,


    ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<InicioComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    //private sistemaService: SistemaService,
    private router: Router,
  ) {}
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
