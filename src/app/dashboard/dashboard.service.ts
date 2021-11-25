import { EventEmitter, Injectable } from '@angular/core';
import { Chart } from './chart';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  tipoDashboard: string;

  // Datasets
  datasetFirebase = [];

  private datasetRegistrosAnoAtual = [];
  private datasetRegistrosAnoAnterior = [];

  private datasetRegistrosPorMesAnoAtual = [
    [], [], [], [], [], [],
    [], [], [], [], [], []
  ];

  private datasetRegistrosPorMesAnoAnterior = [
    [], [], [], [], [], [],
    [], [], [], [], [], []
  ];

  private datasetHeatmap = {
    "type": "FeatureCollection",
    "features": []
  };

  private datasetQuantidadeRegistros = {
    "firms": 0,
    "manual": 0
  };

  private datasetTaxaPorTurno = {
    "noturno": [],
    "diurno": []
  }

  private datasetQuantidadePorMesAnoAtual = [];
  private datasetMediaTemperaturaPorMes = [];
  private datasetMediaPrecipiticaoPorMes = [];
  private datasetMediaIntensidade = [];

  // Filtros
  private municipiosFiltro = [];
  private anosFiltro = [];

  private chart = new Chart();

  // Events
  heatmapEvent = new EventEmitter<object>();

  constructor() {
    this.gerarDatasets();
  }

  carregarFiltros() {
    this.datasetFirebase.forEach(registro => {
      try {
        let ano = registro['acq_date'].split('-')[0];
        this.anosFiltro.push(ano);

        this.municipiosFiltro.push(registro['temperature']['locale']);
      } catch {}
    });

    this.municipiosFiltro = Array.from(new Set(this.municipiosFiltro));
    this.anosFiltro = Array.from(new Set(this.anosFiltro));
  }

  factoryGroupMunicipios(regiao: string, municipios: string[]): object {
    return {
      'label': regiao,
      'items': municipios
    }
  }

  // Geração datasets
  filtrarRegistrosPorAno(municipios: string[], ano: string) {

    const anoAnterior = String((Number(ano) - 1));

    this.datasetFirebase.forEach(registro => {
      try {

        let anoRegistro = registro['acq_date'].split('-')[0];

        if(municipios.includes(registro['temperature']['locale'])) {
          switch(anoRegistro) {
            case ano:
              this.datasetRegistrosAnoAtual.push(registro);
              break;
            case anoAnterior:
              this.datasetRegistrosAnoAnterior.push(registro);
              break;
          }
        }
      } catch {}
    });
    console.log( this.datasetRegistrosAnoAtual.length );
    this.gerarDatasets();
  }

  filtrarRegistrosPorPeriodo(municipios: string[], periodo: Date) {

    const dataInicioPeriodo = new Date(periodo[0]);
    const dataTerminoPeriodo = new Date(periodo[1]);

    const dataInicioPeriodoAnoAnterior = new Date(periodo[0]);
    dataInicioPeriodoAnoAnterior.setFullYear(dataInicioPeriodoAnoAnterior.getFullYear() - 1);
    const dataTerminoPeriodoAnoAnterior = new Date(periodo[1]);
    dataTerminoPeriodoAnoAnterior.setFullYear(dataTerminoPeriodoAnoAnterior.getFullYear() - 1);

    this.datasetFirebase.forEach(registro => {

      const dataRegistro = new Date(registro['acq_date']);

      try {
        if(municipios.includes(registro['temperature']['locale'])) {
          if(dataRegistro >= dataInicioPeriodo && dataRegistro <= dataTerminoPeriodo) {
            this.datasetRegistrosAnoAtual.push(registro);
          } else if(dataRegistro >= dataInicioPeriodoAnoAnterior && dataRegistro <= dataTerminoPeriodoAnoAnterior) {
            this.datasetRegistrosAnoAnterior.push(registro);
          }
        }
      } catch {}
    });
    this.gerarDatasets();
  }

  gerarDatasets() {

    // Gerar dados do ano atual
    this.datasetRegistrosAnoAtual.forEach(registro => {

      // Filtrar dados por mês do ano atual
      this.datasetRegistrosPorMesAnoAtual[(registro['acq_date'].split('-')[1]) - 1].push(registro);

      // Filtrar dados do heatmap
      if(this.tipoDashboard === 'dashboard-por-ano') {
        this.datasetHeatmap['features'].push(
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

      // Filtrar quantidade registros
      try {
        if(registro['userCreated']) {
          this.datasetQuantidadeRegistros.manual++;
        } else {
          this.datasetQuantidadeRegistros.firms++;
        }
      } catch(error) {
        console.log(error);
      }
    });

     // Filtrar dados por mês do ano anterior
    this.datasetRegistrosAnoAnterior.forEach(registro => {
      this.datasetRegistrosPorMesAnoAnterior[((registro['acq_date'].split('-')[1]) - 1)].push(registro);
    });

    // Gerar dados por mês
    this.datasetRegistrosPorMesAnoAtual.forEach(mes => {
      this.adicionarQuantidadePorMesAnoAtual(mes.length);
      this.adicionarMediaTemperaturaEPrecipitacao(mes);
      this.adicionarMediaIntensidade(mes);
      this.adicionarTaxaPorTurno(mes);
    });
  }

  private adicionarQuantidadePorMesAnoAtual(quantidade: number) {
    this.datasetQuantidadePorMesAnoAtual.push(quantidade);
  }

  private adicionarMediaTemperaturaEPrecipitacao(mes: object[]) {
    let registrosTemperaturas = [];
    let registrosPrecipitacao = [];

    if(mes.length > 0) {
      mes.forEach(registro => {
        registrosTemperaturas.push(registro['temperature']['temp_c']);
        registrosPrecipitacao.push(registro['temperature']['precip_in']);
      });

      this.datasetMediaTemperaturaPorMes.push(((registrosTemperaturas.reduce((a, b) => a + b)) / registrosTemperaturas.length).toFixed(1));
      this.datasetMediaPrecipiticaoPorMes.push(((registrosPrecipitacao.reduce((a, b) => a + b)) / registrosPrecipitacao.length).toFixed(1))

    } else {
      this.datasetMediaTemperaturaPorMes.push('0');
      this.datasetMediaPrecipiticaoPorMes.push('0');
    }
  }

  private adicionarMediaIntensidade(mes: object[]) {

    if(mes.length > 0) {

      let registrosNoMes = [];

      mes.forEach(registro => {
        registrosNoMes.push(registro['frp'] === undefined ? 0 : registro['frp']);
      });

      this.datasetMediaIntensidade.push(((registrosNoMes.reduce((a, b) => a + b)) / registrosNoMes.length).toFixed(1));
    } else {
      this.datasetMediaIntensidade.push('0');
    }
  }

  private adicionarTaxaPorTurno(mes: object[]) {

    let quantidadeNoturno = 0;
    let quantidadeDiurno = 0;

    mes.forEach(registro => {
      if(registro['daynight'] === 'D') {
        quantidadeDiurno++;
      } else {
        quantidadeNoturno++;
      }
    });

    this.datasetTaxaPorTurno.noturno.push(quantidadeNoturno);
    this.datasetTaxaPorTurno.diurno.push(quantidadeDiurno);
  }

  private calcularMediaPorMes(): string {
    return (this.datasetRegistrosAnoAtual.length / 12).toFixed(1);
  }

  private calcularTaxaCrescimentoGeral(): string {

    const totalRegistrosAnoAtual = this.datasetRegistrosAnoAtual.length;
    const totalRegistrosAnoAnterior = this.datasetRegistrosAnoAnterior.length;

    if(totalRegistrosAnoAtual === 0) {
      return '0';
    } else if(totalRegistrosAnoAnterior === 0) {
      return '100'
    } else {
      const taxaCrescimento = ((totalRegistrosAnoAtual - totalRegistrosAnoAnterior) / totalRegistrosAnoAnterior).toFixed(2);
      return taxaCrescimento;
    }
  }

  // Geração dos gráficos
  private chartTaxaCrescimento() {

    let quantidadePorMesAnoAnterior = [];
    let dados = [];

    this.datasetRegistrosPorMesAnoAnterior.forEach(mes => {
      quantidadePorMesAnoAnterior.push(mes.length);
    })

    for(let i = 0; i < 12; i++) {
      if(this.datasetQuantidadePorMesAnoAtual[i] === 0 || this.datasetQuantidadePorMesAnoAtual[i] === undefined) {
        dados.push('0');
      } else if(quantidadePorMesAnoAnterior[i] === 0) {
        dados.push('100');
      } else {
        const taxaCrescimento = ((this.datasetQuantidadePorMesAnoAtual[i] - quantidadePorMesAnoAnterior[i]) / quantidadePorMesAnoAnterior[i]).toFixed(1);
        dados.push(taxaCrescimento);
      }
    }

    return this.chart.lineChart('Taxa de Crescimento', dados, 'Crescimento');
  }

  private chartOcorrenciasAtentidasPorMes() {
    const dados = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return this.chart.barChart('Ocorrência Atendidas', dados, 'Quantidade');
  }

  private chartTemperaturaPorPrecipiticao() {

    const dados = [{
      rotulo: 'Focos',
      dataset: this.datasetQuantidadePorMesAnoAtual
    }, {
      rotulo: 'Temperatura',
      dataset: this.datasetMediaTemperaturaPorMes
    }, {
      rotulo: 'Precipitação',
      dataset: this.datasetMediaPrecipiticaoPorMes,
    }];

    return this.chart.comboChart('Média de Temperatura e Precipitação', dados);
  }

  private chartTaxaPorTurno() {

    const dados = [{
      rotulo: 'Noturno',
      dataset: this.datasetTaxaPorTurno.noturno
    }, {
      rotulo: 'Diurno',
      dataset:  this.datasetTaxaPorTurno.diurno
    }];

    return this.chart.doubleLineChart('Taxa por Turno', dados);
  }

  private chartMediaIntensidade() {
    return this.chart.lineChart('Média de Intensidade', this.datasetMediaIntensidade, 'Média de Energia Emitida');
  }

  private chartTaxaRegistros() {
    const dados = [this.datasetQuantidadeRegistros.firms, this.datasetQuantidadeRegistros.manual];
    const labels = ['Sistema', 'Manual'];
    return this.chart.pieChart('Taxa de Registros', dados, labels, 'quantidade');
  }

  // Limpar datasets
  clear() {
    this.datasetRegistrosAnoAtual = [];
    this.datasetRegistrosAnoAnterior = [];
    this.datasetHeatmap.features = [];

    this.datasetRegistrosPorMesAnoAtual = [
      [], [], [], [], [], [],
      [], [], [], [], [], []
    ];

    this.datasetRegistrosPorMesAnoAnterior = [
      [], [], [], [], [], [],
      [], [], [], [], [], []
    ];

    this.datasetQuantidadeRegistros = {
      "firms": 0,
      "manual": 0
    };

    this.datasetTaxaPorTurno = {
      "noturno": [],
      "diurno": []
    }

    this.datasetQuantidadePorMesAnoAtual = [];
    this.datasetMediaTemperaturaPorMes = [];
    this.datasetMediaPrecipiticaoPorMes = [];
    this.datasetMediaIntensidade = [];
  }

   // Retornos dos dados para o front-end
   getMunicipiosFiltro(): object[] {

    let municipios = [];

    this.municipiosFiltro.forEach(municipio => {
      municipios.push({label: municipio, value: municipio});
    });

    const groupMunicipios = this.factoryGroupMunicipios(' ', municipios);
    return [groupMunicipios];
  }

  getAnosFiltro(): string[] {
    return this.anosFiltro;
  }

  getDatasetEstatico(): object[] {

    let mediaPorMes: string;
    const totalRegistros = this.datasetRegistrosAnoAtual.length.toString();
    const taxaCrescimento = this.calcularTaxaCrescimentoGeral();

    if(this.tipoDashboard === 'dashboard-por-ano') {
      mediaPorMes = this.calcularMediaPorMes();
    }

    const datasetEstatico = [
      {"imagem": "../../assets/images/icon-fire.png", "dado": taxaCrescimento.concat('%'), "titulo": "Crescimento"},
      {"imagem": "../../assets/images/icon-grafico.png", "dado": mediaPorMes, "titulo": "Média por mês"},
      {"imagem": "../../assets/images/icon-fire-extinguisher.png", "dado": totalRegistros, "titulo": "Total de Registros"},
      {"imagem": "../../assets/images/icon-atendimento.png", "dado": "0", "titulo": "Total de Ocorrências Atendidas"}
    ];

    // Remover média por mês quando o dashboard for por período
    if(mediaPorMes === undefined) {
      datasetEstatico.splice(1, 1);
    }

    return datasetEstatico;
  }

  getDatasetCharts() {
    return [
      this.chartTaxaCrescimento(),
      this.chartOcorrenciasAtentidasPorMes(),
      this.chartTemperaturaPorPrecipiticao(),
      this.chartTaxaPorTurno(),
      this.chartMediaIntensidade(),
      this.chartTaxaRegistros()
    ];
  }

  getDatasetHeatmap(): object {
    this.heatmapEvent.emit(this.datasetHeatmap);               // Emitir evento para atualizazr o mapa
    return this.datasetHeatmap;
  }

}
