import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { MessageService } from 'primeng/api';

import { map } from 'rxjs/operators';
import { Usuario } from '../usuarios/usuario';

import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    private usuarioService: UsuarioService
  ) {}

  async logar(email: string, senha: string) {
    await this.validarUsuario(email)
      .then(async (user) => {
        user.birthDate = this.usuarioService.obterApenasNumerosDaData(
          user.birthDate
        );

        if (user.firstLogin) {
          if (user.birthDate === senha) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('senha = data');
            Promise.resolve();
          } else {
            return Promise.reject('Credenciais inválidas');
          }
        } else {
          const credenciais = await this.afAuth.signInWithEmailAndPassword(
            email,
            senha
          );

          localStorage.setItem('user', JSON.stringify(user));
        }
      })
      .catch((erro) => {
        if (erro.code === 'auth/too-many-requests') {
          return Promise.reject('Conta bloqueada');
        }
        return Promise.reject(erro);
      });
  }

  async validarUsuario(email: string) {
    if (!this.usuarioService.validarDominioDeEmail(email)) {
      return Promise.reject('E-mail inválido');
    }

    return new Promise<Usuario>((resolve, reject) => {
      this.usuarioService
        .buscarUsuario('email', email)
        .then((u) => {
          if (u.isDeleted) reject('Usuário deletado');

          resolve(u);
        })
        .catch((erro) => {
          reject(erro);
        });
    });
  }

  deslogar() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  get getUsuarioLogado() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
