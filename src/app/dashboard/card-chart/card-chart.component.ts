import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-chart',
  templateUrl: './card-chart.component.html',
  styleUrls: ['./card-chart.component.css']
})
export class CardChartComponent implements OnInit {

  @Input() titulo: string;
  @Input() tipo: string;
  @Input() dataset: object;

  ngOnInit(): void { }

}
