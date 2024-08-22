import { Injectable } from '@angular/core';
import {TouristSite} from "../modelos/TouristSite";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TouristSiteService {
  private apiUrl = 'http://localhost:8080/api/tourist-sites';

  constructor(private http: HttpClient) { }

  getAllSites(): Observable<TouristSite[]> {
    return this.http.get<TouristSite[]>(this.apiUrl);
  }

  createSite(site: TouristSite): Observable<TouristSite> {
    return this.http.post<TouristSite>(this.apiUrl, site);
  }
}
