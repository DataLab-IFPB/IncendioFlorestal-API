import { Component, OnInit, Input } from '@angular/core';
import { IncendioService } from 'src/app/incendios/incendio.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() tipoDashboard: string;

  exibirSpinner = true;

  // Dados
  periodoAno = [];
  municipios = [];
  dadosEstaticos = [];
  dadosGraficos = [];
  dadosHeatmap: object;

  // Filtros
  anoFilter : string;
  municipiosFilter : string[] = [];
  periodoFilter: Date;

  constructor(private dashboardService: DashboardService, private incendioService: IncendioService) { }

  ngOnInit(): void {

    this.incendioService.listar().subscribe((data) => {
      this.dashboardService.datasetFirebase = data;
      this.exibirSpinner = false;
      this.config();
    });

  }

  config() {

    this.dashboardService.carregarFiltros();
    this.dashboardService.gerarDatasets();

    this.municipios = this.dashboardService.getMunicipiosFiltro();

    if(this.tipoDashboard === 'dashboard-por-ano') {
      this.periodoAno = this.dashboardService.getAnosFiltro();
      this.anoFilter = this.periodoAno[0];
    }

    this.atualizar();
  }

  atualizar() {

    this.dashboardService.tipoDashboard = this.tipoDashboard;
    this.dashboardService.clear();

    switch(this.tipoDashboard) {
      case 'dashboard-por-ano':
        this.dashboardService.filtrarRegistrosPorAno(this.municipiosFilter, this.anoFilter);
        this.dadosHeatmap = this.dashboardService.getDatasetHeatmap();
        break;
      case 'dashboard-por-periodo':
        if(this.periodoFilter !== undefined) {
          if(this.periodoFilter[0] !== null && this.periodoFilter[1] !== null) {
            this.dashboardService.filtrarRegistrosPorPeriodo(this.municipiosFilter, this.periodoFilter);
          }
        }
        break;
    }

    this.dadosEstaticos = this.dashboardService.getDatasetEstatico();
    this.dadosGraficos = this.dashboardService.getDatasetCharts();

  }

}
