import { Injectable } from '@angular/core';
import {entornos} from "../Entorno/entornos";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  dynamicHost = entornos.dynamicHost;
  private baseUrl: string = `http://${this.dynamicHost}/api/visitas`;
  constructor(private http: HttpClient) {}
  registerVisit(route: string): Observable<any> {
    return this.http.post(this.baseUrl, { route });
  }
}
//ya anterior mete me habias dado la idea de como hacer lo que es esta ayudame a completar ese reporte
// recuerda que es en excel y pdf:
