import { Component, OnInit, Input } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @Input() tipoDashboard: string;

  exibirSpinner = true;

  // Dados
  periodoAno = [];
  municipios = [];
  dadosQuantitativos = [];
  dadosGraficos = [];
  dadosHeatmap: object;

  // Filtros
  anoFilter: string;
  municipiosFilter: string[] = [];
  periodoFilter: Date;

  constructor(
    private dashboardService: DashboardService,
    private primeConfig: PrimeNGConfig,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.dashboardService.tipoDashboard = this.tipoDashboard;

    this.translate();
    this.dashboardService.carregarFiltros();
    this.dashboardService.gerarDatasets();

    this.dashboardService.initLoadEvent.subscribe(() => {
      this.exibirSpinner = false;
      this.config();
    });
  }

  // Método responsável por traduzir o calendário
  translate() {
    this.translateService.use('pt');
    this.translateService
      .stream('primeng')
      .subscribe((res) => this.primeConfig.setTranslation(res));
  }

  // Método responsável por iniciar as configurações da página durante a inicialização
  config() {
    this.municipios = this.dashboardService.getterFiltrosMunicipios();

    if (this.tipoDashboard === 'dashboard-por-ano') {
      this.periodoAno = this.dashboardService.getterFiltroAnos();
      this.anoFilter = this.periodoAno[this.periodoAno.length - 1];
    }

    this.atualizar();
  }

  atualizar() {
    this.dashboardService.tipoDashboard = this.tipoDashboard;

    this.dashboardService.clearDataset();

    if (this.municipiosFilter.length === 0) {
      // Limpar dados quando não nenhuma cidade foi selecionada
      this.updateDashboard();
    } else {
      switch (this.tipoDashboard) {
        case 'dashboard-por-ano':
          this.dashboardService.filtrarRegistrosPorAno(
            this.municipiosFilter,
            this.anoFilter
          );
          break;
        case 'dashboard-por-periodo':
          if (this.periodoFilter !== undefined) {
            if (
              this.periodoFilter[0] !== null &&
              this.periodoFilter[1] !== null
            ) {
              this.dashboardService.filtrarRegistrosPorPeriodo(
                this.municipiosFilter,
                this.periodoFilter
              );
            }
          }
          break;
      }

      this.dashboardService.updateDataEvent.subscribe((emissor) => {
        if (emissor === this.tipoDashboard) {
          this.updateDashboard();
        }
      });
    }
  }

  private updateDashboard() {
    if (this.tipoDashboard === 'dashboard-por-ano') {
      this.dadosHeatmap = this.dashboardService.getterHeatmap();
    }

    this.dadosQuantitativos = this.dashboardService.getterDadosQuantitativos();
    this.dadosGraficos = this.dashboardService.getterDadosGraficos();
  }
}
