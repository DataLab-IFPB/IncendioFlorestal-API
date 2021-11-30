import { IncendioService } from './../incendio.service';
import { Incendio } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import * as ARR from 'lodash';
import { type } from 'os';

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
  numberItems = 10;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;


  constructor(
    private incendioService: IncendioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // this.listar();
    this.getFogo();
  }


  getFogo(key?) {

    if (this.subscription) this.subscription.unsubscribe()

    this.subscription = this.incendioService.getFire(this.numberItems, key)
      .snapshotChanges()
      .subscribe(async incendios => {

        const incendiosFlag = [];

        for await (let contents of incendios) {
          incendiosFlag.push({ key: contents.payload.key, ...contents.payload.exportVal() })
        }

        this.fires = ARR.slice(incendiosFlag, 0, this.numberItems)
        this.nextKey = ARR.get(incendiosFlag[this.numberItems], 'key')
        this.incendios = ARR.slice(incendiosFlag, 0, this.numberItems) // elimina o último incêndio (ele é a próxima key)

        this.stopSpinner();
      })








  }

  onNext() {
    this.prevKeys.push(ARR.first(this.fires)['key']) // get prev key
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
