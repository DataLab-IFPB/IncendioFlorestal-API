import { ConfirmationService } from 'primeng/api';
import { Usuario } from 'src/app/core/model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

import * as firebase from 'firebase/app';

import { first } from 'rxjs/operators';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioLogado: any;

  constructor(
    public afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService
  ) { }

  async logar(email: string, senha: string) {

    await this.validarLogin(email)

    return this.afAuth.signInWithEmailAndPassword(email, senha)
      .then(credenciais => {
        this.usuarioLogado = credenciais.user;
        localStorage.setItem('user', JSON.stringify(this.usuarioLogado));
      })

  }

  async validarLogin(email: string) {
    await this.usuarioService.buscarUsuarioPorEmail(email)
      .then(user => {

        if (user.isDeleted) {
          return Promise.reject('Usuário deletado!');
        }
      })
  }

  deslogar() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.usuarioLogado = null;
    })
  }

  get getUsuarioLogado() {
    return JSON.parse(localStorage.getItem('user'));
  }

}
