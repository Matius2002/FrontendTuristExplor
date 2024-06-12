import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{
  isModalVisible: boolean = false;
  selectedReport: string = '';

  constructor(
    private router: Router,
  ) {
  }
  ngOnInit(): void {
  }
  showDownloadOptions(reportType: string) {
    this.selectedReport = reportType;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  downloadReport(reportType: string, format: string) {
    let url = '';
    if (reportType === 'sitios') {
      url = format === 'excel' ? 'URL_EXCEL_SITIOS' : 'URL_PDF_SITIOS';
    } else if (reportType === 'usuarios') {
      url = format === 'excel' ? 'URL_EXCEL_USUARIOS' : 'URL_PDF_USUARIOS';
    }

    if (url) {
      window.location.href = url;
    } else {
      alert('Formato no reconocido. Por favor, intenta de nuevo.');
    }

    this.closeModal();
  }


  goBack() {

  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);

  }
}
