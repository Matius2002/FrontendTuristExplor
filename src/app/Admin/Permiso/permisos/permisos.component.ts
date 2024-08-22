import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PermisosService} from "../permisos.service";

interface  Rol {
  id: number;
  rolName: string;
}

interface Permisos {
  id: number;
  name: string;

}
@Component({
  providers: [HttpClient, PermisosService],
  selector: 'app-permisos',
  standalone: true,
  imports: [

  ],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent implements  OnInit{
  ngOnInit(): void {
  }

}
