import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import 'rxjs/add/operator/map';

import * as moment from 'moment';
import * as ARR from 'lodash';

import {
  faWind,
  faTint,
  faTemperatureHigh,
} from '@fortawesome/free-solid-svg-icons';

import { IncendioService } from '../incendio.service';
import { Incendio } from '../incendio';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-incendios-pesquisa',
  templateUrl: './incendios-pesquisa.component.html',
  styleUrls: ['./incendios-pesquisa.component.css'],
})
export class IncendiosPesquisaComponent implements OnInit {
  incendio = new Incendio();

  spinnerIsActive = true;

  textoBuscado: string = '';
  dataBuscada: Date;
  anoAtual = new Date().getFullYear();

  incendios: Array<Incendio> = [];

  numberItems = 28;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;

  icones = {
    temperatura: faTemperatureHigh,
    humidade: faTint,
    vento: faWind,
  };

  constructor(
    private incendioService: IncendioService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getFogo();
  }

  getFogo(key?) {
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.incendioService
      .listar(this.numberItems, key)
      .snapshotChanges()
      .subscribe(async (incendios) => {
        const incendiosFlag = [];

        // for utilizado para verificar se está exluido (todo: tentar remover isso e deixer por conta da query)
        for await (let contents of incendios) {
          const fire = {
            key: contents.payload.key,
            ...contents.payload.exportVal(),
          };
          if (!fire.isDeleted) {
            if (fire.acq_datetime) {
              fire.acq_datetime = moment(fire.acq_datetime).format(
                'DD/MM/YYYY HH:mm:ss'
              );
            }

            incendiosFlag.push(fire);
          }
        }

        this.incendios = ARR.slice(incendiosFlag, 0, this.numberItems); // elimina o último incêndio (ele é a próxima key)
        this.nextKey = ARR.get(incendios[this.numberItems], 'key');

        this.stopSpinner();
      });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.incendios)['key']); // get prev key
    this.getFogo(this.nextKey);
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys); // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys); // delete last key

    this.getFogo(prevKey);
  }

  stopSpinner() {
    this.spinnerIsActive = false;
  }

  listar() {
    this.incendioService.getIncendios().subscribe(
      (incendios) => {
        this.incendios = incendios;
        this.stopSpinner();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filtrar() {
    if (this.textoBuscado == '' && this.dataBuscada == undefined) {
      this.incendios = [];
      this.spinnerIsActive = true;
      this.getFogo();
    } else {
      this.incendios = [];
      this.spinnerIsActive = true;

      this.incendioService.getIncendios().subscribe(
        (incendios) => {
          const incendiosFlag: Array<Incendio> = [];

          incendios.forEach((incendio) => {
            if (!incendio.isDeleted) {
              const status = incendio.ativo;
              const cidade = String(incendio?.clima?.cidade);
              const latitude = String(incendio.latitude);
              const longitude = String(incendio.longitude);
              const periodo = String(incendio.daynight);
              const intencidade = String(incendio.brightness);
              const temperatura = String(incendio.incendio?.clima?.temperatura);
              const humidade = String(incendio?.clima?.humidade_relativa);
              const vento = String(incendio?.clima?.velocidade_vento);
              let data = String(incendio?.acq_datetime).split(' ')[0];
              data = moment(data).format('DD/MM/YYYY');

              const dataBuscadaFormatada = moment(this.dataBuscada).format(
                'DD/MM/YYYY'
              );

              if (incendio.acq_datetime) {
                incendio.acq_datetime = moment(incendio.acq_datetime).format(
                  'DD/MM/YYYY HH:mm:ss'
                );
              }

              if (this.textoBuscado != '' && this.dataBuscada != undefined) {
                if (
                  (status ===
                    this.getStatusComBaseNoTextoDigitado(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (cidade != undefined &&
                    cidade.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (latitude != undefined &&
                    latitude.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (longitude != undefined &&
                    longitude.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (periodo ===
                    this.getPeriodoComBaseNoTextoDigitado(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (intencidade != undefined &&
                    intencidade.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (temperatura != undefined &&
                    temperatura.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (humidade != undefined &&
                    humidade.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada) ||
                  (vento != undefined &&
                    vento.includes(this.textoBuscado) &&
                    data === dataBuscadaFormatada)
                ) {
                  incendiosFlag.push(incendio);
                }
              } else if (this.textoBuscado != '') {
                if (
                  status ===
                    this.getStatusComBaseNoTextoDigitado(this.textoBuscado) ||
                  (cidade != undefined && cidade.includes(this.textoBuscado)) ||
                  (latitude != undefined &&
                    latitude.includes(this.textoBuscado)) ||
                  (longitude != undefined &&
                    longitude.includes(this.textoBuscado)) ||
                  periodo ===
                    this.getPeriodoComBaseNoTextoDigitado(this.textoBuscado) ||
                  (intencidade != undefined &&
                    intencidade.includes(this.textoBuscado)) ||
                  (temperatura != undefined &&
                    temperatura.includes(this.textoBuscado)) ||
                  (humidade != undefined &&
                    humidade.includes(this.textoBuscado)) ||
                  (vento != undefined && vento.includes(this.textoBuscado))
                ) {
                  incendiosFlag.push(incendio);
                }
              } else {
                if (data != undefined && data === dataBuscadaFormatada) {
                  incendiosFlag.push(incendio);
                }
              }
            }
          });

          this.incendios = incendiosFlag;

          this.nextKey = undefined;
          this.prevKeys = [];

          this.stopSpinner();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  excluir(key: string) {
    this.incendioService
      .excluir(key)
      .then(() => {
        this.toastService.showMessage('success', 'Incêndio excluído!');
      })
      .catch((error) => {
        this.toastService.showMessage('error', error);
      });
  }

  confirmarExclusao(incendio: Incendio) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza que deseja excluir esse incêndio?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.excluir(incendio.key);
      },
    });
  }

  getStatusComBaseNoTextoDigitado(textoDigitado: string) {
    if (textoDigitado.toLowerCase() == 'ativo') {
      return true;
    } else if (textoDigitado.toLowerCase() == 'inativo') {
      return false;
    }
    return undefined;
  }

  getPeriodoComBaseNoTextoDigitado(textoDigitado: string) {
    if (textoDigitado.toLowerCase() == 'dia') {
      return 'D';
    } else if (textoDigitado.toLowerCase() == 'noite') {
      return 'N';
    }
    return undefined;
  }
}
