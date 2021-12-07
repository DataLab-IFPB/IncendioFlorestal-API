export class Chart {

  private labelsMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  private cores = {
    red: '#FF6384',
    blue: '#42A5F5',
    oragen: '#FF8C64',
    purple: '#3426FF',
  }

  private factoryChart(titulo: string, tipo: string, labels: string[], dataset: object[]) {
    return {
      "titulo": titulo,
      "tipo": tipo,
      "dados": {
        "labels": labels,
        "datasets": dataset
      }
    }
  }

  private factoryDatasetChart(rotulo: string, dados: any[], borderColor: any, backgroundColor: any) {
    return {
      "label": rotulo,
      "data": dados,
      "fill": false,
      "borderColor": borderColor,
      "backgroundColor": backgroundColor,
      "tension": 0.4
    }
  }

  // Gera gráfico com o dataset incluso
  private generateChart(titulo: string, dados: any[], rotulo: string, tipo: string, labels: string[], borderColor: any, backgroundColor: any) {
    const dataset = this.factoryDatasetChart(rotulo, dados, borderColor, backgroundColor);
    const chart = this.factoryChart(titulo, tipo, labels, [dataset]);
    return chart;
  }

  // Tipos de Gráficos
  barChart(titulo: string, dados: any[], rotulo: string) {
    return this.generateChart(titulo, dados, rotulo, 'bar', this.labelsMeses, this.cores.blue, this.cores.blue);
  }

  lineChart(titulo: string, dados: any[], rotulo: string) {
    return this.generateChart(titulo, dados, rotulo, 'line', this.labelsMeses, this.cores.blue, this.cores.blue);
  }

  pieChart(titulo: string, dados: any[], labels: string[], rotulo: string) {
    const cores = [this.cores.blue, this.cores.red];
    return this.generateChart(titulo, dados, rotulo, 'pie', labels, cores, cores);
  }

  doubleLineChart(titulo: string, dados: any[]) {
    const dataset01 = this.factoryDatasetChart(dados[0].rotulo, dados[0].dataset, this.cores.red, this.cores.red);
    const dataset02 = this.factoryDatasetChart(dados[1].rotulo, dados[1].dataset, this.cores.blue, this.cores.blue);
    return this.factoryChart(titulo, 'line', this.labelsMeses, [dataset01, dataset02]);
  }

  comboChart(titulo: string, dados: any[]) {
    const dataset01 = this.factoryDatasetChart(dados[0].rotulo, dados[0].dataset, this.cores.blue, this.cores.blue);

    const dataset02 = this.factoryDatasetChart(dados[1].rotulo, dados[1].dataset, this.cores.oragen, this.cores.oragen);
    dataset02['type'] = 'line';

    const dataset03 = this.factoryDatasetChart(dados[2].rotulo, dados[2].dataset, this.cores.purple, this.cores.purple);
    dataset03['type'] = 'line';

    return this.factoryChart(titulo, 'bar', this.labelsMeses, [dataset03, dataset02, dataset01]);
  }

}
