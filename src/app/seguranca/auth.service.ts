import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  isLogado = false
  usuarioLogado: any;

  async logar(email: string, senha: string) {
     await this.afAuth.signInWithEmailAndPassword(email, senha)
     .then(credenciais => {
       this.isLogado = true
       this.usuarioLogado = credenciais.user;
       localStorage.setItem('user',JSON.stringify(credenciais.user))
      })

  }

  deslogar() {
    // console.log(this.afAuth.currentUser)
    this.afAuth.signOut();
    localStorage.removeItem('user')
    this.isLogado = false
    this.usuarioLogado = undefined;
  }




}
