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
  ) { }

  logar(email: string, senha: string) {

    // TODO: BUSCAR USUÁRIO NO REALTIME (criar func em usuarioService) E VERIFICAR SE ELE ESTÁ EXCLUÍDO
    // if(this.usuarioBuscado.isExcluido) {
    //   return Promise.reject('Usuário excluído!');
    // }

    return this.afAuth.signInWithEmailAndPassword(email, senha)
      .then(credenciais => {
        this.usuarioLogado = credenciais.user;
        localStorage.setItem('user', JSON.stringify(this.usuarioLogado));
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
