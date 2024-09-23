import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { entornos } from "../Entorno/entornos";
import { catchError, Observable, throwError } from "rxjs";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportService: any;

  obtenerReporteVisitas() {
    throw new Error('Method not implemented.');
  }

  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;

  constructor(private http: HttpClient) { }

  getReportUrl(reportType: string, format: string): Observable<any> {
    let endpoint = '';

    switch (reportType) {
      case 'REPORTE DE USUARIOS':
        endpoint = `${this.baseUrl}/reportes/usuarios/${format}`;
        break;
      case 'REPORTE DE VISITAS':
        endpoint = `${this.baseUrl}/reportes/visitas/${format}`;
        break;
      case 'REPORTE DE COMENTARIOS':
        endpoint = `${this.baseUrl}/reportes/comentarios/${format}`;
        break;
      default:
        throw new Error('Tipo de reporte no soportado');
    }

    console.log("Valor del endpoint: ",endpoint);
    

    return this.http.get(endpoint, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error al obtener el reporte:', error);
        return throwError(error);
      })
    );
  }

  downloadReport(reportType: string, format: string) {
    this.getReportUrl(reportType, format).subscribe((blob: Blob) => { 
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
    }, (error: any) => { 
      console.error('Error al descargar el reporte:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al descargar el reporte. Por favor, intenta de nuevo.',
      });
    });
  }
}

