import { IncendioService } from './../incendio.service';
import { Incendio } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import * as ARR from 'lodash';

@Component({
  selector: 'app-incendios-pesquisa',
  templateUrl: './incendios-pesquisa.component.html',
  styleUrls: ['./incendios-pesquisa.component.css']
})
export class IncendiosPesquisaComponent implements OnInit {


  incendio: Incendio;

  // incendios: Array<Incendio> = [];

  incendios = [];



  spinnerIsActive = true;

  textoBuscado: string = '';
  dataBuscada: Date = new Date();

  anoAtual = new Date().getFullYear();







  //
  fires: any;
  numberItems = 2;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;


  constructor(
    private incendioService: IncendioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.listar();
    // this.getFogo();
  }


  getFogo(key?) {
    if (this.subscription) this.subscription.unsubscribe()

    this.subscription = this.incendioService.getFire(this.numberItems, key)
      .valueChanges()
      .subscribe(customers => {
        this.fires = ARR.slice(customers, 0, this.numberItems)
        this.nextKey = ARR.get(customers[this.numberItems], 'acq_date').toString()


        this.incendios = ARR.slice(customers, 0, this.numberItems)

        console.log('?', ARR.get(customers[this.numberItems], 'acq_date').toString())
        console.log('fogo ---')
        console.log(customers)
      })

  }

  onNext() {
    this.prevKeys.push(ARR.first(this.fires)['acq_date'])
    this.getFogo(this.nextKey)
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys) // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys) // delete last key

    this.getFogo(prevKey)
  }


  //

  stopSpinner() {
    this.spinnerIsActive = false;
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


  filtrar() {
    console.log(this.textoBuscado)
    console.log(this.dataBuscada)

  }


  excluir(key: string) {

    this.incendioService.excluir(key)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Incêndio excluído!' });
      })
      .catch(error => {
        this.messageService.add({ severity: 'error', summary: error });
      })

  }


  confirmarExclusao(incendio: Incendio) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza que deseja excluir esse incêndio?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.excluir(incendio.key);
      }
    });
  }




}
