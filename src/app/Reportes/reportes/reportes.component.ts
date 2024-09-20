import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {UsuarioService} from "../../Admin/Usuarios/usuario.service";
import {ReportService} from "../report.service";
import { VisitService } from '../visit-service.service';

interface  Rol {
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
  imports: [NgClass,HttpClientModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})

export class ReportesComponent implements OnInit{
  visitasPorRuta: any[] = [];
  isModalVisible: boolean = false;
  selectedReport: string = '';

  constructor(
    private router: Router,
    private reportService: ReportService,
    private visitService: VisitService
  ) {}

  ngOnInit(): void {}

  showDownloadOptions(reportType: string) {
    this.selectedReport = reportType;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  downloadReport(reportType: string, format: string) {
    this.reportService.getReportUrl(reportType, format).subscribe(url => {
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const blob = new Blob([url], { type: extension === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${reportType}.${extension}`; 
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      this.closeModal();
    }, error => {
      console.error('Error al descargar el reporte:', error);
      // Reemplazar alert con SweetAlert u otro sistema de notificación que ya uses
      alert('Error al descargar el reporte. Por favor, intenta de nuevo.');
    });
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
