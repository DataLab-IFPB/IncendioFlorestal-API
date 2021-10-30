import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() tipoDashboard: string;

  periodoAno = [];
  municipios = [];
  dadosEstaticos = [];
  dadosGraficos = [];
  dadosHeatmap: object;

  periodoAnoSelecionado : string;
  municipioSelecionado : any;
  periodoSelecionado: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

}
