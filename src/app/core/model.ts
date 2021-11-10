
export class Login {
  email: string;
  password: string;
}
export class Usuario {

  birthDate;
  email: string;
  password: string;
  registration: string;

  firstLogin: boolean;
  isAdmin: boolean = false;
  isDeleted: boolean;

  lastLoginAt: Date;
  deletedAt: Date;
  updatedAt: Date;

  // deletedBy?
  // updatedBy?

  key: string;
  uid: string;
}

export class Incendio {
  acq_date
  acq_datetime
  acq_time


  ativo: boolean;
  userCreated: boolean;

  brightness
  brightness_2

  clima: Clima;
  point: Point;

  confidence
  daynight

  frp

  latitude
  longitude
  satellite

  scan
  track

  version
  WKT
}


// clima
// cidade: "Itaporanga"
// cobertura_nuvem: 8
// direcao_vento: "Norte"
// hora_observacao: "2021-11-03 13:28"
// humidade_relativa: 35.0938
// precipitacao: 0
// temperatura: 32.6
// velocidade_vento: 4.83744
// visibilidade: 24

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
