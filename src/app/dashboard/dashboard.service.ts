import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';

import { Chart } from './factoryChart';
import { Datasets } from './datasets';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private Chart = new Chart();
  private Datasets = Datasets.getIstance();
  private heatmapEvent = new EventEmitter<object>();
  private registros = [];

  initLoadEvent = new EventEmitter();
  updateDataEvent = new EventEmitter<string>();
  tipoDashboard: string;

  constructor(
    private firebase: AngularFireDatabase,
    private http: HttpClient
  ) {}

  // Recuperar municípios e anos que podem ser filtrados
  carregarFiltros() {
    if (this.tipoDashboard === 'dashboard-por-ano') {
      this.http
        .get(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados/25/distritos'
        )
        .subscribe((data: object[]) => {
          if (this.Datasets.filtroMunicipios.length === 0) {
            data.forEach((municipio) => {
              this.Datasets.filtroMunicipios.push(municipio['nome']);
            });
          }

          this.initLoadEvent.emit();
        });

      // Gerar range de anos (2021 até o ano atual)
      if (this.Datasets.filtroAno.length === 0) {
        let ano = 2021;

        while (true) {
          this.Datasets.filtroAno.push(String(ano));

          if (ano === new Date().getFullYear()) {
            break;
          } else {
            ano++;
          }
        }
      }
    }
  }

  // Recuperar dados do(s) município(s) referente ao ano selecionado no filtro
  // e do ano anterior
  filtrarRegistrosPorAno(municipios: string[], ano: string) {
    this.obterRegistros(municipios, ano, this.obterRegistrosPorAno);
  }

  private obterRegistrosPorAno(ano: string, context: any) {
    const anoAnterior = String(Number(ano) - 1);

    context.registros.forEach((registro: object) => {
      const anoRegistro = registro['status']['registered_at'].split('-')[0];

      // Verificar o ano do registro
      switch (anoRegistro) {
        case ano:
          context.Datasets.registrosAnoAtual.push(registro);
          break;
        case anoAnterior:
          context.Datasets.registrosAnoAnterior.push(registro);
          break;
      }
    });

    // Gerar os datasets dos gráficos com base nos dados filtrados
    context.gerarDatasets();
    context.registros.length = 0;
  }

  // Recuperar dados do(s) município(s) referente a um determinado
  // período selecionado
  filtrarRegistrosPorPeriodo(municipios: string[], periodo: Date) {
    this.obterRegistros(municipios, periodo, this.obterRegistrosPorPeriodo);
  }

  private obterRegistrosPorPeriodo(periodo: Date, context: any) {
    // Datas selecionadas no filtro
    const dataInicioPeriodo = new Date(periodo[0]);
    const dataTerminoPeriodo = new Date(periodo[1]);

    // Datas do ano anteiror referente ao filtro
    const dataInicioPeriodoAnoAnterior = new Date(
      `${
        dataInicioPeriodo.getFullYear() - 1
      }-${dataInicioPeriodo.getMonth()}-${dataInicioPeriodo.getDate()}`
    );

    const dataTerminoPeriodoAnoAnterior = new Date(
      `${
        dataTerminoPeriodo.getFullYear() - 1
      }-${dataTerminoPeriodo.getMonth()}-${dataTerminoPeriodo.getDate()}`
    );

    context.registros.forEach((registro: object) => {
      try {
        const dataRegistro = new Date(registro['status']['registered_at']);

        // Filtrar por registros no intervalo de datas
        if (
          dataRegistro >= dataInicioPeriodo &&
          dataRegistro <= dataTerminoPeriodo
        ) {
          context.Datasets.registrosAnoAtual.push(registro);
        } else if (
          dataRegistro >= dataInicioPeriodoAnoAnterior &&
          dataRegistro <= dataTerminoPeriodoAnoAnterior
        ) {
          context.Datasets.registrosAnoAnterior.push(registro);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // Gerar os datasets dos gráficos com base nos dados filtrados
    context.registros = [...context.Datasets.registrosAnoAtual];
    context.gerarDatasets();
    context.registros.length = 0;
  }

  gerarDatasets() {
    try {
      if (this.Datasets.registrosAnoAtual.length > 0) {
        this.registros.forEach((registro) => {

          // Registrar dados por mês do ano atual
          this.Datasets.registrosPorMesAnoAtual[
            +registro['status']['registered_at'].split('-')[1] - 1
          ].push(registro);

          // Registrar dados do heatmap
          if (this.tipoDashboard === 'dashboard-por-ano') {
            this.Datasets.heatmap.features.push({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [registro['longitude'], registro['latitude']],
              },
            });
          }

          if (registro['userCreated']) {
            this.Datasets.tipoRegistro.manual++;
          } else {
            this.Datasets.tipoRegistro.firms++;
          }
        });

        // Registrar dados por mês do ano anterior
        this.Datasets.registrosAnoAnterior.forEach((registro) => {
          this.Datasets.registrosPorMesAnoAnterior[
            +registro['status']['registered_at'].split('-')[1] - 1
          ].push(registro);
        });


        // Gerar dados por mês
        this.Datasets.registrosPorMesAnoAtual.forEach((mes, indice) => {
          const registrostemp_cs = [];
          const registrosprecip_in = [];
          const registrosIntensidade = [];
          const registrosPorTurno = { noturno: 0, diurno: 0 };

          // Total no mês
          this.Datasets.totalPorMes[indice] = mes.length;

          mes.forEach((registro: object) => {
            registrostemp_cs.push(registro['weather']['temp_c']);
            registrosprecip_in.push(registro['weather']['precip_in']);
            registrosIntensidade.push(
              registro['frp'] === undefined ? 0 : Number(registro['frp'])
            );

            if (registro['daynight'] && registro['daynight'] === 'D') {
              registrosPorTurno.diurno++;
            } else {
              registrosPorTurno.noturno++;
            }
          });

          // Adicionar os dados ao dataset
          this.adicionarMediatemp_cEprecip_in(
            registrostemp_cs,
            registrosprecip_in,
            indice
          );
          this.adicionarMediaIntensidade(registrosIntensidade, indice);
          this.adicionarTaxaPorTurno(registrosPorTurno, indice);
        });
      }

      this.updateDataEvent.emit(this.tipoDashboard);
    } catch (error) {
      console.log("🚀 ~ file: dashboard.service.ts:212 ~ DashboardService ~ gerarDatasets ~ error:", error)
    }
  }

  // Getters filtros
  getterFiltrosMunicipios(): object[] {
    let municipios = [];

    // Definir qual região um município pertence
    this.Datasets.filtroMunicipios.forEach((municipio) => {
      municipios.push({ label: municipio, value: municipio });
    });

    return [{ label: ' ', items: municipios }];
  }

  getterFiltroAnos(): string[] {
    return this.Datasets.filtroAno;
  }

  // Getters dados do relatório
  getterDadosQuantitativos(): object[] {
    const totalRegistros = this.Datasets.registrosAnoAtual.length.toString();
    const taxaCrescimento = this.calcularTaxaCrescimentoGeral();

    let mediaPorMes: string;

    if (this.tipoDashboard === 'dashboard-por-ano') {
      mediaPorMes = this.calcularMediaPorMes();
    }

    const dadosQuantitativos = [
      {
        imagem: '../../assets/images/icon-fire.png',
        dado: taxaCrescimento.concat('%'),
        titulo: 'Crescimento',
      },
      {
        imagem: '../../assets/images/icon-grafico.png',
        dado: mediaPorMes,
        titulo: 'Média por mês',
      },
      {
        imagem: '../../assets/images/icon-fire-extinguisher.png',
        dado: totalRegistros,
        titulo: 'Total de Registros',
      },
      {
        imagem: '../../assets/images/icon-atendimento.png',
        dado: '0',
        titulo: 'Total de Ocorrências Atendidas',
      },
    ];

    // Remover média por mês quando o dashboard for por período
    if (mediaPorMes === undefined) {
      dadosQuantitativos.splice(1, 1);
    }

    return dadosQuantitativos;
  }

  getterDadosGraficos() {
    return [
      this.graficoTaxaCrescimento(),
      this.graficotemp_cPorPrecipiticao(),
      this.graficoTaxaPorTurno(),
      this.graficoMediaIntensidade(),
      this.graficoTaxaRegistros(),
      this.graficoOcorrenciasAtentidasPorMes()
    ];
  }

  getterHeatmap(): object {
    this.heatmapEvent.emit(this.Datasets.heatmap); // Emitir evento para atualizazr o mapa
    return this.Datasets.heatmap;
  }

  // Permitir a inscrição no evento de atualização de dados
  getterHeatmapEvent(): EventEmitter<object> {
    return this.heatmapEvent;
  }

  // Recuperar dados do firebase
  private consultarFirebase(municipio: string) {
    return this.firebase
      .list('fires', (ref) =>
        ref.orderByChild('weather/locale').equalTo(municipio)
      )
      .valueChanges();
  }

  // Recuperar registros do(s) municpio(s)
  // @param callback: função para obter os registros por ano ou por periodo
  private obterRegistros(
    municipios: string[],
    data: any,
    callback: (data: any, context: any) => void
  ) {
    municipios.forEach((municipio) => {
      let registrosDoMunicipio = this.Datasets.consultarMunicipio(municipio);

      if (registrosDoMunicipio.length === 0) {
        this.consultarFirebase(municipio).subscribe((dados: object[]) => {
          this.registros.push(...dados);
          callback(data, this);
        });
      } else {
        this.registros.push(...registrosDoMunicipio);
        callback(data, this);
      }
    });
  }

  clearDataset() {
    this.Datasets.clear();
  }

  private adicionarMediatemp_cEprecip_in(
    registrostemp_cs: any[],
    registrosprecip_in: any[],
    indiceMes: number
  ) {
    // Função reduce soma todos os valores da lista
    if (registrostemp_cs.length > 0) {
      this.Datasets.mediaTemperaturaPorMes[indiceMes] +=
        registrostemp_cs.reduce((a, b) => a + b) /
        registrostemp_cs.length;
    }

    if (registrosprecip_in.length > 0) {
      this.Datasets.mediaPrecipiticaoPorMes[indiceMes] +=
        registrosprecip_in.reduce((a, b) => a + b) /
        registrosprecip_in.length;
    }
  }

  private adicionarMediaIntensidade(
    registrosIntensidade: any[],
    indiceMes: number
  ) {
    // Função reduce soma todos os valores da lista
    if (registrosIntensidade.length > 0) {
      this.Datasets.mediaIntensidade[indiceMes] +=
        registrosIntensidade.reduce((a, b) => a + b) /
        registrosIntensidade.length;
    }
  }

  private adicionarTaxaPorTurno(registrosPorTurno: object, indiceMes: number) {
    this.Datasets.taxaPorTurno.diurno[indiceMes] += registrosPorTurno['diurno'];
    this.Datasets.taxaPorTurno.noturno[indiceMes] +=
      registrosPorTurno['noturno'];
  }

  private calcularMediaPorMes(): string {
    return (this.Datasets.registrosAnoAtual.length / 12).toFixed(1);
  }

  private calcularTaxaCrescimentoGeral(): string {
    const totalRegistrosAnoAtual = this.Datasets.registrosAnoAtual.length;
    const totalRegistrosAnoAnterior = this.Datasets.registrosAnoAnterior.length;

    if (totalRegistrosAnoAtual === 0) {
      // Caso o ano atual não possua registros
      return '0';
    } else if (totalRegistrosAnoAnterior === 0) {
      // Caso o ano anterior não possua registros
      return '100';
    } else {
      // É possível calcular a taxa de crescimento
      // Cálculo da taxa de crescimento
      return (
        (totalRegistrosAnoAtual - totalRegistrosAnoAnterior) /
        totalRegistrosAnoAnterior
      ).toFixed(2);
    }
  }

  // Geração dos gráficos
  private graficoTaxaCrescimento() {
    let quantidadePorMesAnoAnterior = [];
    let dados = [];

    this.Datasets.registrosPorMesAnoAnterior.forEach((mes) => {
      quantidadePorMesAnoAnterior.push(mes.length);
    });

    for (let i = 0; i < 12; i++) {
      if (
        this.Datasets.totalPorMes[i] === 0 ||
        this.Datasets.totalPorMes.length === 0
      ) {
        // Se o mês do ano atual não possui registros
        dados.push('0');
      } else if (quantidadePorMesAnoAnterior[i] === 0) {
        // Se o mês do ano anterior não possui registros
        dados.push('100');
      } else {
        // É possível calcular a taxa de crescimento
        const taxaCrescimento = (
          (this.Datasets.totalPorMes[i] - quantidadePorMesAnoAnterior[i]) /
          quantidadePorMesAnoAnterior[i]
        ).toFixed(1);
        dados.push(taxaCrescimento);
      }
    }

    return this.Chart.lineChart('Taxa de Crescimento', dados, 'Crescimento');
  }

  private graficoOcorrenciasAtentidasPorMes() {
   this.Datasets.registrosAnoAtual.forEach((registro) => {
      const totalNoMes = this.Datasets.totalAtendimentoPorMes[+registro['status']['registered_at'].split('-')[1] - 1];

      if (!!registro['status']['in_attendance_at']) {
        this.Datasets.totalAtendimentoPorMes[
          +registro['status']['registered_at'].split('-')[1] - 1
        ] = totalNoMes + 1;
      }
    });


    return this.Chart.barChart('Ocorrência Atendidas', this.Datasets.totalAtendimentoPorMes, 'Quantidade');
  }

  private graficotemp_cPorPrecipiticao() {
    const dados = [
      {
        rotulo: 'Focos',
        dataset: this.Datasets.totalPorMes,
      },
      {
        rotulo: 'Temperatura',
        dataset: this.Datasets.mediaTemperaturaPorMes,
      },
      {
        rotulo: 'Precipitação',
        dataset: this.Datasets.mediaPrecipiticaoPorMes,
      },
    ];

    return this.Chart.comboChart('Média de Temperatura e Precipitação', dados);
  }

  private graficoTaxaPorTurno() {
    const dados = [
      {
        rotulo: 'Noturno',
        dataset: this.Datasets.taxaPorTurno.noturno,
      },
      {
        rotulo: 'Diurno',
        dataset: this.Datasets.taxaPorTurno.diurno,
      },
    ];

    return this.Chart.doubleLineChart('Taxa por Turno', dados);
  }

  private graficoMediaIntensidade() {
    return this.Chart.lineChart(
      'Média de Intensidade',
      this.Datasets.mediaIntensidade,
      'Média de Energia Emitida'
    );
  }

  private graficoTaxaRegistros() {
    const dados = [
      this.Datasets.tipoRegistro.firms,
      this.Datasets.tipoRegistro.manual,
    ];

    return this.Chart.pieChart(
      'Taxa de Registros',
      dados,
      ['Sistema', 'Manual'],
      'quantidade'
    );
  }
}
