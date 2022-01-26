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
