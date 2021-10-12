import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
  ) { }

  async logar(email: string, senha: string) {

    await this.validarLogin(email)

    return this.afAuth.signInWithEmailAndPassword(email, senha)
      .then(credenciais => {
        localStorage.setItem('user', JSON.stringify(credenciais.user));
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
    })
  }

  get getUsuarioLogado() {
    return JSON.parse(localStorage.getItem('user'));
  }

}
