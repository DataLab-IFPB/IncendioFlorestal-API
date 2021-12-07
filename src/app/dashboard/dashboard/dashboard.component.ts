import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {

    this.dashboardService.getterData().subscribe((data) => {
      this.dashboardService.setterDataFirebase(data);
      this.exibirSpinner = false;
      this.config();
    });

  }

  config() {

    this.dashboardService.carregarFiltros();
    this.dashboardService.gerarDatasets();

    this.municipios = this.dashboardService.getterFiltrosMunicipios();

    if(this.tipoDashboard === 'dashboard-por-ano') {
      this.periodoAno = this.dashboardService.getterFiltroAnos();
      this.anoFilter = this.periodoAno[0];
    }

    this.atualizar();
  }

  atualizar() {

    this.dashboardService.tipoDashboard = this.tipoDashboard;
    this.dashboardService.clearDataset();

    switch(this.tipoDashboard) {
      case 'dashboard-por-ano':
        this.dashboardService.filtrarRegistrosPorAno(this.municipiosFilter, this.anoFilter);
        this.dadosHeatmap = this.dashboardService.getterHeatmap();
        break;
      case 'dashboard-por-periodo':
        if(this.periodoFilter !== undefined) {
          if(this.periodoFilter[0] !== null && this.periodoFilter[1] !== null) {
            this.dashboardService.filtrarRegistrosPorPeriodo(this.municipiosFilter, this.periodoFilter);
          }
        }
        break;
    }

    this.dadosEstaticos = this.dashboardService.getterDadosQuantitativos();
    this.dadosGraficos = this.dashboardService.getterDadosGraficos();

  }

}
