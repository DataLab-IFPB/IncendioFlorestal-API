export class Datasets {

  // Coleção de dados do Firebase
  firebaseColection = [];

  // Coleções utilizadas para filtros de dados
  filtroMunicipios = [];
  filtroAno = [];

  // Coleções utilizadas nos gráficos após os filtros serem aplicados
  registrosAnoAtual = [];
  registrosAnoAnterior = [];

  registrosPorMesAnoAtual = [
    [], [], [], [], [], [],
    [], [], [], [], [], []
  ];

 registrosPorMesAnoAnterior = [
    [], [], [], [], [], [],
    [], [], [], [], [], []
  ];

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

  clear() : void {

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

    this.registrosPorMesAnoAtual = [
      [], [], [], [], [], [],
      [], [], [], [], [], []
    ];

   this.registrosPorMesAnoAnterior = [
      [], [], [], [], [], [],
      [], [], [], [], [], []
    ];

  }

}
