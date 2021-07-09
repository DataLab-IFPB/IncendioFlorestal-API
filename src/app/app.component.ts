import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'combate-incendios';

  constructor(public afAuth: AngularFireAuth) { }


  isLoggedIn = false

  async signIn(email: string, password: string) {
     await this.afAuth.signInWithEmailAndPassword(email, password)
     .then(res=>{
      this.isLoggedIn = true
      localStorage.setItem('user',JSON.stringify(res.user))
    })

  }

  signOut() {
    this.afAuth.signOut();
    localStorage.removeItem('user')
  }

}
