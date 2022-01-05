export class Datasets {

  private static instance: Datasets;

  // Coleção de dados do Firebase
  firebaseColection = [];

  // Coleções utilizadas para filtros de dados
  filtroMunicipios = [];
  filtroAno = [];

  // Coleções utilizadas nos gráficos após os filtros serem aplicados
  registrosAnoAtual = [];
  registrosAnoAnterior = [];

  registrosPorMesAnoAtual = [];

  registrosPorMesAnoAnterior = [];

  totalPorMes = [];
  mediaTemperaturaPorMes = [];
  mediaPrecipiticaoPorMes = [];
  mediaIntensidade = [];

  heatmap = {
    "type": "FeatureCollection",
    "features": []
  };

  tipoRegistro = {
    "firms": 0,
    "manual": 0
  };

  taxaPorTurno = {
    "noturno": [],
    "diurno": []
  }

  private constructor() {
    // Inicializar posições da tabela hash
    for(let i = 0; i < 25; i++) {
      this.firebaseColection.push([]);
    }
  }

  // Criar uma única instância da classe
  static getIstance(): Datasets {

    if(!Datasets.instance) {
      Datasets.instance = new Datasets();
    }

    return Datasets.instance;
  }

  private calcularHash(municipio: string) {
    return municipio.charCodeAt(0) % 65;
  }

  // Adicionar registros de um município a tabela hash
  adicionarRegistros(registros: object[]) {
    const registro = registros[0];
    const hash = this.calcularHash(registro['clima']['cidade']);

    registros.forEach((registro) => {
      this.firebaseColection[hash].push(registro);
    });
  }

  consultarMunicipio(municipio: string) : object[] {
    const hash = this.calcularHash(municipio);
    const registros = this.firebaseColection[hash];

    const registrosMunicipio = registros.filter(
      (registro: object) => {
        if(registro['clima']['cidade'] === municipio) {
          return registro;
        }
    });

    return registrosMunicipio;
  }

  clear() {
    this.registrosAnoAtual.length = 0;
    this.registrosAnoAnterior.length = 0;
    this.mediaTemperaturaPorMes.length = 0;
    this.mediaPrecipiticaoPorMes.length = 0;
    this.mediaIntensidade.length = 0;
    this.totalPorMes.length = 0;
    this.heatmap.features.length = 0;
    this.taxaPorTurno.diurno.length = 0;
    this.taxaPorTurno.noturno.length = 0;
    this.tipoRegistro.firms = 0;
    this.tipoRegistro.manual = 0;
    this.registrosPorMesAnoAtual.length = 0;
    this.registrosPorMesAnoAnterior.length = 0;

    this.inicializarVetoresVazios();
  }

  private inicializarVetoresVazios() {
    for(let i = 0; i < 12; i++) {
      this.registrosPorMesAnoAtual.push([]);
      this.registrosPorMesAnoAnterior.push([]);
      this.mediaTemperaturaPorMes.push(0);
      this.mediaPrecipiticaoPorMes.push(0);
      this.mediaIntensidade.push(0);
      this.totalPorMes.push(0);
      this.taxaPorTurno.diurno.push(0);
      this.taxaPorTurno.noturno.push(0);
    }
  }

}