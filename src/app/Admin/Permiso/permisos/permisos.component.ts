// Importaciones necesarias desde Angular y otros módulos
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PermisosService } from "../permisos.service";

// Definición de la interfaz `Rol` para representar un rol en el sistema
interface Rol {
  id: number; // Identificador único del rol
  rolName: string; // Nombre del rol
}

// Definición de la interfaz `Permisos` para representar los permisos en el sistema
interface Permisos {
  id: number; // Identificador único del permiso
  name: string; // Nombre del permiso
}

// Decorador del componente que define la configuración del mismo
@Component({
  providers: [HttpClient, PermisosService], // Proveedores de servicios necesarios para el componente
  selector: 'app-permisos', // Selector utilizado para insertar este componente en la aplicación
  standalone: true, // Indica que el componente es independiente
  imports: [], // Lista de módulos que se importan y utilizan dentro del componente
  templateUrl: './permisos.component.html', // Ruta del archivo de plantilla HTML para este componente
  styleUrl: './permisos.component.css' // Ruta del archivo CSS para los estilos de este componente
})
export class PermisosComponent implements OnInit { // Define la clase `PermisosComponent` que implementa `OnInit`
  // Método que se ejecuta automáticamente cuando el componente se inicializa
  ngOnInit(): void {
    // Actualmente, no realiza ninguna acción al inicializar
  }
}
