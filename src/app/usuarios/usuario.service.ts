import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase} from '@angular/fire/database';

import { Usuario } from './../core/model';

import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AuthService } from '../seguranca/auth.service';

import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private dbPath = '/users';

  constructor(
    private  afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    ) { }




  cadastrar(usuario: Usuario){
    return this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.senha)
    .then(credenciais => {

      // TODO: como setar o nome do documento com o uid?

      const user = {
        uid: credenciais.user.uid,
        nome: usuario.nome,
        matricula: usuario.matricula,
        email: usuario.email,
        isAdmin: usuario.isAdmin
      }

      this.db.list(this.dbPath).push(user);

    })
  }


  atualizar(usuario: Usuario) {

    // verificar se foi passada a senha (caso o usuário tenha vindo da área de perfil)


    // atualizar os dados da collection (realtime) e alterar o email do usuário no (user - authorization)

    const user = {
      uid: usuario.uid,
      nome: usuario.nome,
      matricula: usuario.matricula,
      email: usuario.email,
      isAdmin: usuario.isAdmin
    }

    return this.db.list(this.dbPath).update(usuario.key, user)
  }


  listar() {
    return this.db.list('users')
    .snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.exportVal() })
        )
      )
    )



  }


  excluir(key: string, uid: string) {

    console.log('--- removendo ---')
    console.log('--- key: ', key)
    console.log('--- uid: ', uid)
    // excluir a key (realtime collection) e o user (uid - user - authorization)

    // remove user by uid


  // REMOVE item in collection
  return this.db.object(`${this.dbPath}/${key}`).remove();
  // return null;
  }



  resetarSenha(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
  }


}
