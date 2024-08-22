import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {entornos} from "../Entorno/entornos";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api`;
  constructor(private http: HttpClient) { }
  getReportUrl(reportType: string, format: string): Observable<any> {
    let endpoint = '';
    if (reportType === 'usuarios') {
      endpoint = `${this.baseUrl}/reportes/usuarios/${format}`;
    } else if (reportType === 'visitas') {
      endpoint = `${this.baseUrl}/reportes/visitas/${format}`;
    } else if (reportType === 'comentarios') {
      endpoint = `${this.baseUrl}/reportes/comentarios/${format}`;
    }
    return this.http.get(endpoint, { responseType: 'blob' });
  }
  downloadUserExcel() {
    return this.http.get('/reportes/usuarios/excel', { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadUserPDF() {
    return this.http.get('/reportes/usuarios/pdf', { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
