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

  async logar(email: string, password: string) {
     await this.afAuth.signInWithEmailAndPassword(email, password)
     .then(res=>{
       localStorage.setItem('user',JSON.stringify(res.user))
       this.isLogado = true
       this.usuarioLogado = JSON.parse(localStorage.getItem('user'));
    })

  }

  deslogar() {
    // console.log(this.afAuth.currentUser)
    this.afAuth.signOut();
    localStorage.removeItem('user')
    this.isLogado = false
    this.usuarioLogado = undefined;
  }

  resetarSenha(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
  }


}
