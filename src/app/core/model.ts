
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
  key: string;

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
