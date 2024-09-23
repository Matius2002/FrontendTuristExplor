import { Component, OnInit } from '@angular/core';
import { NgClass } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClientModule, HttpResponse } from "@angular/common/http";
import { UsuarioService } from "../../Admin/Usuarios/usuario.service";
import { ReportService } from "../report.service";
import { VisitService } from '../visit-service.service';
import Swal from 'sweetalert2';

interface Rol {
  id: number;
  rolName: string;
  rolDescripc: string;
  rolFechaCreac: Date;
  rolFechaModic: Date;
}

interface Usuarios {
  id: number;
  nombreUsuario: string;
  email: string;
  password: string;
  fechaRegistro: Date;
  rol: Rol;
}

@Component({
  providers: [UsuarioService, ReportService],
  selector: 'app-reportes',
  standalone: true,
  imports: [NgClass, HttpClientModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})

export class ReportesComponent implements OnInit {
  visitasPorRuta: any[] = [];
  isModalVisible: boolean = false;
  selectedReport: string = '';

  constructor(
    private router: Router,
    private reportService: ReportService,
    private visitService: VisitService
  ) { }

  ngOnInit(): void { }

  showDownloadOptions(reportType: string) {
    this.selectedReport = reportType;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  downloadReport(reportType: string, format: string) {
    
    const fecha = new Date();
    const fechaFormato = fecha.toLocaleDateString('es-ES').replace(/\//g, '-'); 
    const horaFormato = fecha.toLocaleTimeString('es-ES').replace(/:/g, '-');   

    const filename = `${reportType} ${fechaFormato} A LAS ${horaFormato}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

    this.reportService.getReportUrl(reportType, format).subscribe((response: Blob) => {
      const blob = new Blob([response], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename; 
      document.body.appendChild(a); 
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a); 

      this.closeModal();
    }, (error) => {
      console.error('Error al descargar el reporte:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al descargar el reporte. Por favor, intenta de nuevo.',
      });
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
