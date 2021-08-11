import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';

import { Usuario, Login } from './../core/model';

import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AuthService } from '../seguranca/auth.service';

import * as admin from 'firebase-admin';

import { first } from 'rxjs/operators';
import { threadId } from 'worker_threads';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private dbPath = '/users';

  constructor(
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private messageService: MessageService
  ) { }

  cadastrar(usuario: Usuario) {
    return this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.senha)
      .then(credenciais => {
        // TODO: como setar o nome do documento com o uid?

        const user = {
          uid: credenciais.user.uid,
          nome: usuario.nome,
          matricula: usuario.matricula,
          email: usuario.email,
          isAdmin: usuario.isAdmin,
          isExcluido: false,
          dataExclusao: null
        }

        this.db.list(this.dbPath).push(user);

      })
  }

  atualizarPerfil(usuario: Usuario, credenciaisLogin: Login) {

    console.log(credenciaisLogin)

    return this.afAuth.signInWithEmailAndPassword(credenciaisLogin.email, credenciaisLogin.senha)
      .then(userCredential => {

        if (usuario.email != credenciaisLogin.email) {
          console.log('ALTERAR O EMAIL')
          userCredential.user.updateEmail(usuario.email);
        }

        if (usuario.senha != "" && usuario.senha != undefined) {
          console.log('ALTERAR A SENHA')
          userCredential.user.updatePassword(usuario.senha);
        }

        const user = {
          uid: usuario.uid,
          nome: usuario.nome,
          matricula: usuario.matricula,
          email: usuario.email,
          isAdmin: usuario.isAdmin
        }



        const localStorageUser = JSON.parse(localStorage.getItem('user'));
        localStorageUser.email = usuario.email;

        // localStorage.removeItem('user')
        // localStorage.setItem('user', JSON.stringify(userCredential.user));
        localStorage.setItem('user', JSON.stringify(localStorageUser));

        this.db.list(this.dbPath).update(usuario.key, user)
        this.messageService.add({ severity: 'success', summary: 'Perfil atualizado!' });

      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: 'A senha informada está incorreta!.' });
      })

  }




  atualizar(usuario: Usuario) {

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

  // TODO: criar método que realiza a busca de um usuário específico (para evitar a duplição já existente)

  // buscarUsuario(key: string) {

  //   // console.log("???", this.usuarioService.getUserProfile)

  //   this.usuarioService.listar()
  //   .subscribe(users => {

  //     let flag = false;

  //     users.forEach(user => {
  //       if(user.uid === key) {
  //         this.usuario = user;
  //         flag = true;
  //       }
  //     })

  //     if(!flag){
  //       this.messageService.add({severity:'error', summary: 'Usuário não encontrado.'});
  //     }

  //   }, (error) => {
  //     console.log(error);
  //   });

  // }





  // getUserInDataBase(uid: string)
  // {
  // get usuário logado
  //  this.afAuth.authState.subscribe(user => {console.log('user loggedIn: ', user)})


  // console.log('-- ', this.db.list('/users', ref => ref.orderByChild('uid').equalTo(uid)))
  // return this.db.list('/users', ref => ref.orderByChild('uid').equalTo(uid))


  // this.db.object('/users/' + uid)
  // .valueChanges()
  // .subscribe(usuarioEncontrado => {
  //   console.log('usuario encontrado ', usuarioEncontrado)
  // })




  // firebase.database().ref('companies').orderByChild('owner').equalTo(id)
  // .once('value')
  // .then(snapshot => {
  //   const records = snapshot.val();
  //   console.log(`Companies whose owner id is ${id}: `, records);
  // })
  // .catch(error => console.log(error));



  // }


  excluir(key: string) {

    const user = {
      isExcluido: true,
      dataExclusao: new Date()
    }

    return this.db.list(this.dbPath).update(key, user);
  }


  resetarSenha(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
  }


  get getUsuarioLogado() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

}
