import { Injectable } from '@angular/core';
import { entornos } from "../Entorno/entornos";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api/visitas`;

  constructor(private http: HttpClient) {}

  // Método para registrar una visita
  registerVisit(route: string): Observable<any> {
    return this.http.post(this.baseUrl, { route });
  }

  // Método para descargar el reporte en formato Excel
  downloadReportExcel(): Observable<Blob> {
    const url = `${this.baseUrl}/reporte/excel`; // Asegúrate que esta ruta esté configurada en el backend
    return this.http.get(url, {
      responseType: 'blob', // Indica que la respuesta será un archivo binario (Blob)
    });
  }

  // Método para descargar el reporte en formato PDF
  downloadReportPDF(): Observable<Blob> {
    const url = `${this.baseUrl}/reporte/pdf`; // Asegúrate que esta ruta esté configurada en el backend
    return this.http.get(url, {
      responseType: 'blob', // Indica que la respuesta será un archivo binario (Blob)
    });
  }
}
