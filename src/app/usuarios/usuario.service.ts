import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';

import { Usuario, Login } from './../core/model';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs-compat/add/operator/first';


import * as moment from 'moment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private dbPath = '/users';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private messageService: MessageService,
    private router: Router
  ) { }

  cadastrar(usuario: Usuario) {
    return this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.password)
      .then(credenciais => {

        const user = {
          name: usuario.name,
          surname: usuario.surname,
          birthDate: usuario.birthDate,
          email: usuario.email,
          registration: usuario.registration,
          firstLogin: true,
          isAdmin: usuario.isAdmin,
          isDeleted: false,
          lastLoginAt: "",
          deletedAt: "",
          updatedAt: "",
          uid: credenciais.user.uid
        }

        this.db.list(this.dbPath).push(user);
      })
  }

  atualizarPerfil(usuario: Usuario, credenciaisLogin: Login) {

    return this.afAuth.signInWithEmailAndPassword(credenciaisLogin.email, credenciaisLogin.password)
      .then(userCredential => {

        if (usuario.email != credenciaisLogin.email) {
          userCredential.user.updateEmail(usuario.email);
        }

        if (usuario.password != "" && usuario.password != undefined) {
          userCredential.user.updatePassword(usuario.password);
        }

        const user = {
          name: usuario.name,
          surname: usuario.surname,
          birthDate: moment(usuario.birthDate).format('DD/MM/YYYY'),
          email: usuario.email,
          registration: usuario.registration,
          isAdmin: usuario.isAdmin,
          updatedAt: new Date(),
        }

        const localStorageUser = JSON.parse(localStorage.getItem('user'));
        localStorageUser.email = usuario.email;

        localStorage.setItem('user', JSON.stringify(localStorageUser));

        this.db.list(this.dbPath).update(usuario.key, user)
        this.messageService.add({ severity: 'success', summary: 'Perfil atualizado!' });

      })
      .catch(erro => {
        console.log(erro)
        this.messageService.add({ severity: 'error', summary: 'A senha informada está incorreta!.' });
      })

  }

  atualizar(usuario: Usuario) {

    const user = {
      name: usuario.name,
      surname: usuario.surname,
      birthDate: moment(usuario.birthDate).format('DD/MM/YYYY'),
      registration: usuario.registration,
      isAdmin: usuario.isAdmin,
      updatedAt: new Date(),
    }

    return this.db.list(this.dbPath).update(usuario.key, user)
  }

  atualizarFirstLogin(usuario: Usuario) {

    const user = {
      firstLogin: false,
    }

    return this.db.list(this.dbPath).update(usuario.key, user)
  }

  atualizarSenha(usuario: Usuario, credenciaisLogin: Login) {

    return this.afAuth.signInWithEmailAndPassword(credenciaisLogin.email, credenciaisLogin.password)
      .then(userCredential => {

        if (usuario.password != "" && usuario.password != undefined) {
          userCredential.user.updatePassword(usuario.password);
          this.atualizarFirstLogin(usuario);

          this.messageService.add({ severity: 'success', summary: 'Senha atualizada!' });
          this.router.navigate(['/home']);
        } else {
          return Promise.reject('Informe uma senha válida!');
        }

      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: 'A senha informada está incorreta!.' });
      })

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


  buscarUsuarioPorUid(uid: string) {

    let usuarioEncontrado;

    return this.listar()
      .map(users => {

        let flag = false;

        users.forEach(user => {
          if (user.uid === uid) {
            usuarioEncontrado = user;
            usuarioEncontrado.birthDate = moment(user.birthDate, 'DD-MM-YYYY').toDate();
            flag = true;
          }
        })

        if (!flag) {
          this.messageService.add({ severity: 'error', summary: 'Usuário não encontrado.' });
        }

        return usuarioEncontrado;
      })
      .first()
      .toPromise()
  }

  buscarUsuarioPorEmail(email: string) {

    let usuarioEncontrado;

    return this.listar()
      .map(users => {

        users.forEach(user => {
          if (user.email === email) {
            usuarioEncontrado = user;
          }
        })

        return usuarioEncontrado;
      })
      .first()
      .toPromise()
  }

  excluir(key: string) {

    const user = {
      isDeleted: true,
      deletedAt: new Date()
    }

    return this.db.list(this.dbPath).update(key, user);
  }

  resetarSenha(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
  }

  validarDominioDeEmail(email) {
    return email.endsWith("@bombeirospb.gov")
  }

}
