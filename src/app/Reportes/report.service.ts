// Importaciones necesarias
import { Injectable } from '@angular/core'; // Importa `Injectable` para definir un servicio
import { HttpClient } from "@angular/common/http"; // Importa `HttpClient` para manejar solicitudes HTTP
import { entornos } from "../Entorno/entornos"; // Importa las configuraciones de entornos
import { catchError, Observable, throwError } from "rxjs"; // Importa `Observable` para manejar respuestas asincrónicas

// Decorador `Injectable` para que el servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root' // El servicio estará disponible de forma global sin necesidad de declararlo en un módulo
})
export class ReportService {
  // Host dinámico según el entorno (desarrollo, producción, staging)
  dynamicHost = entornos.dynamicHost;
  // URL base de la API construida con el host dinámico
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  // Constructor que inyecta el servicio HttpClient para realizar solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para obtener la URL de un reporte específico en el formato deseado
getReportUrl(reportType: string, format: string): Observable<any> {
  let endpoint = ''; 
  if (reportType === 'usuarios') {
    endpoint = `${this.baseUrl}/reportes/usuarios/${format}`;
  } else if (reportType === 'visitas') {
    endpoint = `${this.baseUrl}/reportes/visitas/${format}`;
  } else if (reportType === 'comentarios') {
    endpoint = `${this.baseUrl}/reportes/comentarios/${format}`;
  }

  // Realiza una solicitud GET al endpoint seleccionado, esperando una respuesta de tipo `blob`
  return this.http.get(endpoint, { responseType: 'blob' }).pipe(
    catchError(error => {
      console.error('Error al obtener el reporte:', error);
      return throwError(error);
    })
  );
}

  // Método para descargar un reporte de usuarios en formato Excel
  downloadUserExcel() {
    // Realiza una solicitud GET para obtener el archivo Excel
    return this.http.get('/reportes/usuarios/excel', { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob); // Crea una URL temporal para el archivo blob
      const a = document.createElement('a'); // Crea un elemento <a> para simular la descarga
      a.href = url; // Asigna la URL al href del enlace
      a.download = 'usuarios.xlsx'; // Establece el nombre del archivo descargado
      a.click(); // Simula un clic para iniciar la descarga
      window.URL.revokeObjectURL(url); // Revoca la URL para liberar memoria
    });
  }

  // Método para descargar un reporte de usuarios en formato PDF
  downloadUserPDF() {
    // Realiza una solicitud GET para obtener el archivo PDF
    return this.http.get('/reportes/usuarios/pdf', { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob); // Crea una URL temporal para el archivo blob
      const a = document.createElement('a'); // Crea un elemento <a> para simular la descarga
      a.href = url; // Asigna la URL al href del enlace
      a.download = 'usuarios.pdf'; // Establece el nombre del archivo descargado
      a.click(); // Simula un clic para iniciar la descarga
      window.URL.revokeObjectURL(url); // Revoca la URL para liberar memoria
    });
  }
}
