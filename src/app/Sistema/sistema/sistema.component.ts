import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  providers: [HttpClient],
  selector: 'app-sistema',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './sistema.component.html',
  styleUrl: './sistema.component.css'
})
export class SistemaComponent implements OnInit{
  isHelpModalVisible: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    //public dialogRef: MatDialogRef<SistemaComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    //private sistemaService: SistemaService,
    private router: Router,
  ) {}
  ngOnInit(): void {

  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleHelpModal() {
    this.isHelpModalVisible = !this.isHelpModalVisible;
  }
}
