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
import { Console } from 'console';
import { TypeScriptEmitter } from '@angular/compiler';
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

  async cadastrar(usuario: Usuario) {

    await this.verificarExistenciaDeMatricula(usuario.registration).then(u => {
      if (u) {
        return Promise.reject("Matrícula já utilizada");
      }
    })

    usuario.birthDate = moment(usuario.birthDate).format('DD/MM/YYYY');
    usuario.birthDate = usuario.birthDate.replace(/[^0-9]/g, '');

    const user = {
      birthDate: usuario.birthDate,
      email: usuario.email,
      registration: usuario.registration,
      firstLogin: true,
      isAdmin: usuario.isAdmin,
      isDeleted: false,
      lastLoginAt: "",
      deletedAt: "",
      updatedAt: "",
      uid: ""
    }

    this.db.list(this.dbPath).push(user);
    return Promise.resolve();
  }

  async atualizarPerfil(usuario: Usuario, credenciaisLogin: Login) {


    await this.verificarExistenciaDeMatricula(usuario.registration).then(u => {
      if (u) {

        if (u.key != usuario.key) {
          return Promise.reject("Matrícula já utilizada");
        }
      }
    })


    return this.afAuth.signInWithEmailAndPassword(credenciaisLogin.email, credenciaisLogin.password)
      .then(userCredential => {

        if (usuario.email != credenciaisLogin.email) {
          userCredential.user.updateEmail(usuario.email);
        }

        if (usuario.password != "" && usuario.password != undefined) {
          userCredential.user.updatePassword(usuario.password);
        }

        const user = {
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

        location.reload(); // para atualizar a matricula presente no menu [DAR UM JEITO DE MELHORAR ISSO (adicionar os dados do realtime no local storage ao invés de apenas as credenciais)]
      })
      .catch(erro => {
        if (erro.code === "auth/too-many-requests") {
          this.messageService.add({ severity: 'error', summary: 'Conta temporariamente desativada devido a muitas tentativas de login malsucedidas.', detail: ' Tente novamente mais tarde!' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'A senha informada está incorreta!.' });
        }
      })

  }


  async atualizar(usuario: Usuario) {

    await this.verificarExistenciaDeMatricula(usuario.registration).then(u => {
      if (u) {
        if (u.key != usuario.key) {
          return Promise.reject("Matrícula já utilizada");
        }
      }
    })

    const user = {
      birthDate: moment(usuario.birthDate).format('DD/MM/YYYY'),
      registration: usuario.registration,
      isAdmin: usuario.isAdmin,
      updatedAt: new Date(),
    }

    return this.db.list(this.dbPath).update(usuario.key, user)
  }


  atualizarFirstLogin(key: string) {

    const user = {
      firstLogin: false,
    }

    return this.db.list(this.dbPath).update(key, user)
  }

  atualizarUid(key: string, uid: string) {

    const user = {
      uid: uid,
    }

    return this.db.list(this.dbPath).update(key, user)
  }


  atualizarSenha(usuario: Usuario, credenciaisLogin: Login) {

    return this.afAuth.signInWithEmailAndPassword(credenciaisLogin.email, credenciaisLogin.password)
      .then(userCredential => {

        if (usuario.password != "" && usuario.password != undefined) {
          userCredential.user.updatePassword(usuario.password);
          this.atualizarFirstLogin(usuario.uid);

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



  criarUsuarioFirstLogin(key: string, email: string, senha: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, senha)
      .then(credenciais => {

        localStorage.setItem('user', JSON.stringify(credenciais.user));

        this.atualizarFirstLogin(key);
        this.atualizarUid(key, credenciais.user.uid);
      })
      .catch(err => {
        console.log(err);
      })

  }


  listar() {
    return this.db.list(this.dbPath)
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
          ({
            key: c.payload.key, ...c.payload.exportVal()
          })
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

  buscarUsuarioPorMatricula(matricula: string) {
    let usuarioEncontrado;

    return this.listar()
      .map(users => {

        users.forEach(user => {
          if (user.registration == matricula) {
            user.birthDate = moment(user.birthDate, 'DD-MM-YYYY').toDate();
            user.birthDate = moment(user.birthDate).format('DD/MM/YYYY')
            usuarioEncontrado = user;
          }
        })

        return usuarioEncontrado;
      })
      .first()
      .toPromise()
  }


  buscarUsuarioPorEmailEDataNascimento(email: string, dataNascimento: string) {
    let usuarioEncontrado;

    return this.listar()
      .map(users => {

        users.forEach(user => {
          if (user.email == email && user.birthDate == dataNascimento) {
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

  validarDominioDeEmail(email: string) {
    return email.endsWith("@bombeirospb.gov")
  }

  verificarExistenciaDeEmail(email: string) {
    let usuarioEncontrado = false;

    return this.listar()
      .map(users => {

        users.forEach(user => {
          if (user.email == email) {
            usuarioEncontrado = true;
          }
        })

        return usuarioEncontrado;
      })
      .first()
      .toPromise()
  }


  verificarExistenciaDeMatricula(matricula: string) {
    let usuarioEncontrado;

    return this.listar()
      .map(users => {

        users.forEach(user => {
          if (user.registration == matricula) {
            usuarioEncontrado = user;
          }
        })

        return usuarioEncontrado;
      })
      .first()
      .toPromise()
  }


}
