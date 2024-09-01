// Importaciones necesarias desde Angular y otros módulos
import { NgModule } from "@angular/core"; // Decorador para definir módulos de Angular
import { BrowserModule } from "@angular/platform-browser"; // Módulo necesario para aplicaciones web que se ejecutan en un navegador
import { AppComponent } from "../app.component"; // Componente principal de la aplicación
import { HttpClientModule, provideHttpClient } from "@angular/common/http"; // Módulo y proveedor para manejar solicitudes HTTP

// Decorador `NgModule` que define las propiedades del módulo de la aplicación
@NgModule({
  // Lista de módulos que se importan y utilizan dentro de este módulo
  imports: [
    BrowserModule, // Proporciona las herramientas esenciales para la ejecución de una aplicación Angular en el navegador
    AppComponent, // Se importa directamente el componente principal (posible error, ya que debería estar en `declarations`)
    HttpClientModule // Proporciona funcionalidades para hacer solicitudes HTTP dentro de la aplicación
  ],
  // Lista de componentes, directivas y tuberías que pertenecen a este módulo
  declarations: [
    // Aquí se declaran los componentes, directivas y pipes que se utilizarán en este módulo
  ],
  // Proveedores de servicios que estarán disponibles para los componentes de este módulo
  providers: [
    provideHttpClient() // Proveedor para configurar y manejar las solicitudes HTTP en la aplicación
  ],
  // Componente(s) de arranque que Angular carga cuando se inicia la aplicación
  bootstrap: [
    // Debería incluir `AppComponent` para arrancar la aplicación con este componente
  ]
})
export class AppModule {} // Exporta la clase `AppModule`, definiendo así el módulo principal de la aplicación
