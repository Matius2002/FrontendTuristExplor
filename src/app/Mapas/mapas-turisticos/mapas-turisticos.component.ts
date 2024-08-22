import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {TouristSite} from "../../modelos/TouristSite";
import {TouristSiteService} from "../tourist-site.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  providers: [TouristSiteService, HttpClient],
  selector: 'app-mapas-turisticos',
  standalone: true,
  imports: [
    HttpClientModule,
  ],
  templateUrl: './mapas-turisticos.component.html',
  styleUrl: './mapas-turisticos.component.css'
})
export class MapasTuristicosComponent implements OnInit{
  constructor(private siteService: TouristSiteService) { }

  ngOnInit(): void {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    this.siteService.getAllSites().subscribe((sites: TouristSite[]) => {
      sites.forEach(site => {
        const marker = L.marker([site.latitude, site.longitude]).addTo(map);
        marker.bindPopup(`<b>${site.title}</b><br>${site.content}<br>Tipo de Turismo: ${site.tourismType}`).openPopup();
      });
    });
  }
}
