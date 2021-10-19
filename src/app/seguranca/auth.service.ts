import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

import { MessageService } from 'primeng/api';

import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) { }

  async logar(email: string, senha: string) {

    await this.validarLogin(email)

    return this.afAuth.signInWithEmailAndPassword(email, senha)
      .then(credenciais => {
        localStorage.setItem('user', JSON.stringify(credenciais.user));
      })
  }

  async validarLogin(email: string) {

    if (!this.usuarioService.validarDominioDeEmail(email))
      return Promise.reject("E-mail inválido");

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
    })
  }

  get getUsuarioLogado() {
    return JSON.parse(localStorage.getItem('user'));
  }

}
