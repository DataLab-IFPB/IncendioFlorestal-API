import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  isLogado = false

  async logar(email: string, password: string) {
     await this.afAuth.signInWithEmailAndPassword(email, password)
     .then(res=>{
      this.isLogado = true
      localStorage.setItem('user',JSON.stringify(res.user))
    })

  }

  deslogar() {
    this.afAuth.signOut();
    localStorage.removeItem('user')
    this.isLogado = false
  }


}
