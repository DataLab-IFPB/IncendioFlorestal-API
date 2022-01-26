export class Incendio {
  key: string;

  acq_date;
  acq_datetime;
  acq_time;

  ativo: boolean;
  userCreated: boolean;

  brightness;
  brightness_2;

  clima: Clima;
  point: Point;

  confidence;
  daynight;

  frp;

  latitude;
  longitude;
  satellite;

  scan;
  track;

  version;
  WKT;

  isDeleted: boolean;
  deletedAt: Date;
  updatedAt: Date;
}

export class Clima {
  cidade;
  cobertura_nuvem;
  direcao_vento;
  hora_observacao;
  humidade_relativa;
  precipitacao;
  temperatura;
  velocidade_vento;
  visibilidade;
}

export class Point {
  0;
  1;
}
