import { IncendioService } from './../incendio.service';
import { Incendio } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-incendios-pesquisa',
  templateUrl: './incendios-pesquisa.component.html',
  styleUrls: ['./incendios-pesquisa.component.css']
})
export class IncendiosPesquisaComponent implements OnInit {


  incendio: Incendio;

  // incendios: Array<Incendio> = [];

  incendios = [];

  busca: string = '';

  spinnerIsActive = true;

  constructor(
    private incendioService: IncendioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.incendioService.listar()
      .subscribe(incendios => {

        this.incendios = incendios;
        // console.log(incendios)
        this.stopSpinner();

      }, (error) => {
        console.log(error);
      });
  }

  // TODO

  // filter
  filtrar() {

  }

  // create
  // update
  // delete

  stopSpinner() {
    this.spinnerIsActive = false;
  }
}
