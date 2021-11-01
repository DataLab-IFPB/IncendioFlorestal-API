import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() tipoDashboard: string;

  // Dados
  periodoAno = [];
  municipios = [];
  dadosEstaticos = [];
  dadosGraficos = [];
  dadosHeatmap: object;

  // Filtros
  anoFilter : string;
  municipiosFilter : string[] = [];
  periodoFilter: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void { }

  exibirMensagem(): boolean {
    return this.municipiosFilter.length === 0 ? true : false;
  }

}
