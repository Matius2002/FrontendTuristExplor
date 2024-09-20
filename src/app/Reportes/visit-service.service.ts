import { Injectable } from '@angular/core';
import { entornos } from "../Entorno/entornos";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api/reportes/visitas`;

  constructor(private http: HttpClient) {}

  // Método para registrar una visita
  registerVisit(route: string): Observable<any> {
    return this.http.post(this.baseUrl, { route });
  }

  // Método para descargar el reporte en formato dinámico (Excel o PDF)
  downloadReport(format: string): Observable<Blob> {
    const url = `${this.baseUrl}/${format}`; // URL dinámica para Excel o PDF
    return this.http.get(url, {
      responseType: 'blob', // Respuesta será un archivo binario (Blob)
    });
  }
}

