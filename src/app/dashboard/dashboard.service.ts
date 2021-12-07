import { EventEmitter, Injectable } from '@angular/core';
import { Chart } from './factoryChart';
import { Datasets } from './datasets';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import 'rxjs/add/operator/map';
import 'rxjs-compat/add/operator/first';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private Chart = new Chart();
  private Datasets = new Datasets();
  private heatmapEvent = new EventEmitter<object>();

  tipoDashboard: string;

  constructor(private firebase: AngularFireDatabase) {
    this.gerarDatasets();
  }

  // Recuperar municípios e anos que podem ser filtrados
  carregarFiltros() {

    const filtroMunicipios = new Set();
    const filtroAno = new Set();

    try {
      this.Datasets.firebaseColection.forEach(registro => {

        filtroMunicipios.add(registro['temperature']['locale']);
        filtroAno.add(registro['acq_date'].split('-')[0]);

      });

      // Converter set para list para evitar filtros duplicados
      this.Datasets.filtroMunicipios = Array.from(filtroMunicipios);
      this.Datasets.filtroAno = Array.from(filtroAno);
    } catch(error) {
      console.log(error);
    }

  }

  // Recuperar dados do(s) município(s) referente ao ano selecionado no filtro
  // e do ano anterior
  filtrarRegistrosPorAno(municipios: string[], ano: string) {

    const anoAnterior = String((Number(ano) - 1));

    this.Datasets.firebaseColection.forEach(registro => {

      try {
        if(municipios.includes(registro['temperature']['locale'])) {

          const anoRegistro = registro['acq_date'].split('-')[0];

          // Verificar o ano do registro
          switch(anoRegistro) {
            case ano:
              this.Datasets.registrosAnoAtual.push(registro);
              break;
            case anoAnterior:
              this.Datasets.registrosAnoAnterior.push(registro);
              break;
          }
        }
      } catch(error) {
        console.log(error);
      }
    });

    // Gerar os datasets dos gráficos com base nos dados filtrados
    this.gerarDatasets();
  }

   // Recuperar dados do(s) município(s) referente a um determinado
   // período selecionado
  filtrarRegistrosPorPeriodo(municipios: string[], periodo: Date) {

    // Datas selecionadas no filtro
    const dataInicioPeriodo = new Date(periodo[0]);
    const dataTerminoPeriodo = new Date(periodo[1]);

    // Datas do ano anteiror referente ao filtro
    const dataInicioPeriodoAnoAnterior = new Date(
      `${dataInicioPeriodo.getFullYear() - 1}-${dataInicioPeriodo.getMonth()}-${dataInicioPeriodo.getDate()}`);

    const dataTerminoPeriodoAnoAnterior = new Date(
      `${dataTerminoPeriodo.getFullYear() - 1}-${dataTerminoPeriodo.getMonth()}-${dataTerminoPeriodo.getDate()}`);

   this.Datasets.firebaseColection.forEach(registro => {

      try {
        const dataRegistro = new Date(registro['acq_date']);

        if(municipios.includes(registro['temperature']['locale'])) {

          // Filtrar por registros no intervalo de datas
          if(dataRegistro >= dataInicioPeriodo && dataRegistro <= dataTerminoPeriodo) {
            this.Datasets.registrosAnoAtual.push(registro);
          } else if(dataRegistro >= dataInicioPeriodoAnoAnterior && dataRegistro <= dataTerminoPeriodoAnoAnterior) {
            this.Datasets.registrosAnoAnterior.push(registro);
          }
        }
      } catch(error) {
        console.log(error);
      }
    });

    // Gerar os datasets dos gráficos com base nos dados filtrados
    this.gerarDatasets();
  }

  gerarDatasets() {

    this.Datasets.registrosAnoAtual.forEach(registro => {

      // Registrar dados por mês do ano atual
      this.Datasets.registrosPorMesAnoAtual[(registro['acq_date'].split('-')[1]) - 1].push(registro);

      // Registrar dados do heatmap
      if(this.tipoDashboard === 'dashboard-por-ano') {

       this.Datasets.heatmap.features.push(
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [registro['longitude'], registro['latitude']]
              }
          }
        );
      }

      if(registro['userCreated']) {
        this.Datasets.tipoRegistro.manual++;
      } else {
        this.Datasets.tipoRegistro.firms++;
      }
    });

     // Registrar dados por mês do ano anterior
    this.Datasets.registrosAnoAnterior.forEach(registro => {
     this.Datasets.registrosPorMesAnoAnterior[((registro['acq_date'].split('-')[1]) - 1)].push(registro);
    });

    // Gerar dados por mês
    this.Datasets.registrosPorMesAnoAtual.forEach(mes => {

      const registrosTemperaturas = [];
      const registrosPrecipitacao = [];
      const registrosIntensidade = [];
      const registrosPorTurno = {noturno: 0, diurno: 0};

      // Total no mês
      this.Datasets.totalPorMes.push(mes.length);

      mes.forEach(registro => {

        registrosTemperaturas.push(registro['temperature']['temp_c']);
        registrosPrecipitacao.push(registro['temperature']['precip_in']);
        registrosIntensidade.push(registro['frp'] === undefined ? 0 : registro['frp']);

        if(registro['daynight'] === 'D') {
          registrosPorTurno.diurno++;
        } else {
          registrosPorTurno.noturno++;
        }
      });

      // Adicionar os dados ao dataset
      this.adicionarMediaTemperaturaEPrecipitacao(registrosTemperaturas, registrosPrecipitacao);
      this.adicionarMediaIntensidade(registrosIntensidade);
      this.adicionarTaxaPorTurno(registrosPorTurno);
    });
  }

   // Getters filtros
   getterFiltrosMunicipios(): object[] {

    let municipios = [];

    // Definir qual região um município pertence
    this.Datasets.filtroMunicipios.forEach(municipio => {
      municipios.push({label: municipio, value: municipio});
    });

    return [{label: '', items: municipios}];
  }

  getterFiltroAnos(): string[] {
    return this.Datasets.filtroAno;
  }

  // Getters dados do relatório
  getterDadosQuantitativos(): object[] {

    const totalRegistros = this.Datasets.registrosAnoAtual.length.toString();
    const taxaCrescimento = this.calcularTaxaCrescimentoGeral();

    let mediaPorMes: string;

    if(this.tipoDashboard === 'dashboard-por-ano') {
      mediaPorMes = this.calcularMediaPorMes();
    }

    const dadosQuantitativos = [
      {"imagem": "../../assets/images/icon-fire.png", "dado": taxaCrescimento.concat('%'), "titulo": "Crescimento"},
      {"imagem": "../../assets/images/icon-grafico.png", "dado": mediaPorMes, "titulo": "Média por mês"},
      {"imagem": "../../assets/images/icon-fire-extinguisher.png", "dado": totalRegistros, "titulo": "Total de Registros"},
      {"imagem": "../../assets/images/icon-atendimento.png", "dado": "0", "titulo": "Total de Ocorrências Atendidas"}
    ];

    // Remover média por mês quando o dashboard for por período
    if(mediaPorMes === undefined) {
      dadosQuantitativos.splice(1, 1);
    }

    return dadosQuantitativos;
  }

  getterDadosGraficos() {
    return [
      this.graficoTaxaCrescimento(),
      this.graficoOcorrenciasAtentidasPorMes(),
      this.graficoTemperaturaPorPrecipiticao(),
      this.graficoTaxaPorTurno(),
      this.graficoMediaIntensidade(),
      this.graficoTaxaRegistros()
    ];
  }

  getterHeatmap(): object {
    this.heatmapEvent.emit(this.Datasets.heatmap);    // Emitir evento para atualizazr o mapa
    return this.Datasets.heatmap;
  }

  // Permitir a inscrição no evento de atualização de dados
  getterHeatmapEvent() : EventEmitter<object> {
    return this.heatmapEvent;
  }

  // Recuperar dados do firebase
  getterData() {
    return this.firebase.list('/dados-firms')
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
          ({
            key: c.payload.key, ...c.payload.exportVal()
          })
          )
        )
      );
  }

  setterDataFirebase(collection: any) {
    this.Datasets.firebaseColection = collection;
  }

  clearDataset() {
    this.Datasets.clear();
  }

  private adicionarMediaTemperaturaEPrecipitacao(registrosTemperaturas: any[],registrosPrecipitacao: any[]) {

    // Função reduce soma todos os valores da lista
    this.Datasets.mediaTemperaturaPorMes.push(
      registrosTemperaturas.length === 0 ? '0' : ((registrosTemperaturas.reduce((a, b) => a + b)) / registrosTemperaturas.length).toFixed(1));

    this.Datasets.mediaPrecipiticaoPorMes.push(
      registrosTemperaturas.length === 0 ? '0' : ((registrosPrecipitacao.reduce((a, b) => a + b)) / registrosPrecipitacao.length).toFixed(1))

  }

  private adicionarMediaIntensidade(registrosIntensidade: any[]) {

    // Função reduce soma todos os valores da lista
    this.Datasets.mediaIntensidade.push(
      registrosIntensidade.length === 0 ? '0' : ((registrosIntensidade.reduce((a, b) => a + b)) / registrosIntensidade.length).toFixed(1));

  }

  private adicionarTaxaPorTurno(registrosPorTurno: object) {
    this.Datasets.taxaPorTurno.diurno.push(registrosPorTurno['diurno']);
    this.Datasets.taxaPorTurno.noturno.push(registrosPorTurno['noturno']);
  }

  private calcularMediaPorMes(): string {
    return (this.Datasets.registrosAnoAtual.length / 12).toFixed(1);
  }

  private calcularTaxaCrescimentoGeral(): string {

    const totalRegistrosAnoAtual = this.Datasets.registrosAnoAtual.length;
    const totalRegistrosAnoAnterior = this.Datasets.registrosAnoAnterior.length;

    if(totalRegistrosAnoAtual === 0) {                // Caso o ano atual não possua registros
      return '0';
    } else if(totalRegistrosAnoAnterior === 0) {      // Caso o ano anterior não possua registros
      return '100'
    } else {                                          // É possível calcular a taxa de crescimento
      // Cálculo da taxa de crescimento
      return ((totalRegistrosAnoAtual - totalRegistrosAnoAnterior) / totalRegistrosAnoAnterior).toFixed(2);
    }

  }

  // Geração dos gráficos
  private graficoTaxaCrescimento() {

    let quantidadePorMesAnoAnterior = [];
    let dados = [];

    this.Datasets.registrosPorMesAnoAnterior.forEach(mes => {
      quantidadePorMesAnoAnterior.push(mes.length);
    })

    for(let i = 0; i < 12; i++) {

      if(this.Datasets.totalPorMes[i] === 0) {              // Se o mês do ano atual não possui registros
        dados.push('0');
      } else if(quantidadePorMesAnoAnterior[i] === 0) {     // Se o mês do ano anterior não possui registros
        dados.push('100');
      } else {                                              // É possível calcular a taxa de crescimento
        const taxaCrescimento = ((this.Datasets.totalPorMes[i] - quantidadePorMesAnoAnterior[i]) / quantidadePorMesAnoAnterior[i]).toFixed(1);
        dados.push(taxaCrescimento);
      }

    }

    return this.Chart.lineChart('Taxa de Crescimento', dados, 'Crescimento');
  }

  private graficoOcorrenciasAtentidasPorMes() {
    // Ainda não possui implementação
    const dados = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return this.Chart.barChart('Ocorrência Atendidas', dados, 'Quantidade');
  }

  private graficoTemperaturaPorPrecipiticao() {

    const dados = [{
      rotulo: 'Focos',
      dataset: this.Datasets.totalPorMes
    }, {
      rotulo: 'Temperatura',
      dataset: this.Datasets.mediaTemperaturaPorMes
    }, {
      rotulo: 'Precipitação',
      dataset: this.Datasets.mediaPrecipiticaoPorMes,
    }];

    return this.Chart.comboChart('Média de Temperatura e Precipitação', dados);
  }

  private graficoTaxaPorTurno() {

    const dados = [{
      rotulo: 'Noturno',
      dataset: this.Datasets.taxaPorTurno.noturno
    }, {
      rotulo: 'Diurno',
      dataset:  this.Datasets.taxaPorTurno.diurno
    }];

    return this.Chart.doubleLineChart('Taxa por Turno', dados);
  }

  private graficoMediaIntensidade() {
    return this.Chart.lineChart('Média de Intensidade', this.Datasets.mediaIntensidade, 'Média de Energia Emitida');
  }

  private graficoTaxaRegistros() {

    const dados = [
      this.Datasets.tipoRegistro.firms,
      this.Datasets.tipoRegistro.manual
    ];

    return this.Chart.pieChart('Taxa de Registros', dados, ['Sistema', 'Manual'], 'quantidade');
  }

}
