
export class Login {
  email: string;
  password: string;
}
// export class Usuario {
//   key: string;
//   uid: string;
//   nome: string;
//   matricula: number;
//   email: string;
//   senha: string;
//   isAdmin: boolean = false;
//   isExcluido: boolean = false;
//   dataExclusao: Date;
//   dataNascimento: Date;
// }


export class Usuario {

  name: string;
  surname: string;
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
