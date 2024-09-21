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
  obtenerReporteVisitas() {
    throw new Error('Method not implemented.');
  }
  // Host dinámico según el entorno (desarrollo, producción, staging)
  dynamicHost = entornos.dynamicHost;
  // URL base de la API construida con el host dinámico
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  // Constructor que inyecta el servicio HttpClient para realizar solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para obtener la URL de un reporte específico en el formato deseado
getReportUrl(reportType: string, format: string): Observable<any> {
  let endpoint = ''; 

    switch (reportType) {
      case 'usuarios':
        endpoint = `${this.baseUrl}/reportes/usuarios/${format}`;
        break;
      case 'visitas':
        endpoint = `${this.baseUrl}/reportes/visitas/${format}`;
        break;
      case 'comentarios':
        endpoint = `${this.baseUrl}/reportes/comentarios/${format}`;
        break;
      default:
        throw new Error('Tipo de reporte no soportado');
    }

  // Realiza una solicitud GET al endpoint seleccionado, esperando una respuesta de tipo `blob`
  return this.http.get(endpoint, { responseType: 'blob' }).pipe(
    catchError(error => {
      console.error('Error al obtener el reporte:', error);
      return throwError(error);
    })
  );
}

  // Método genérico para descargar el reporte
  downloadReport(reportType: string, format: string) {
    this.getReportUrl(reportType, format).subscribe(blob => {
      const url = window.URL.createObjectURL(blob); // Crear una URL temporal para el blob
      const a = document.createElement('a'); // Crear un enlace para descargar el archivo
      a.href = url;
      a.download = `${reportType}.${format}`; // Usar el tipo de reporte y formato en el nombre del archivo
      a.click(); // Simular clic para iniciar la descarga
      window.URL.revokeObjectURL(url); // Revocar la URL para liberar memoria
    });
  }
}

