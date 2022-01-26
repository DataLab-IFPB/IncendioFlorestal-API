import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { MessageService } from 'primeng/api';

import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { Login } from 'src/app/seguranca/seguranca';
import { Usuario } from './usuario';
import { AuthService } from '../seguranca/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private dbPath = '/users';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private messageService: MessageService,
    private router: Router
  ) {}

  async cadastrar(usuario: Usuario) {
    await this.verificarExistencia(usuario.registration)
      .then(() => {
        usuario.birthDate = this.obterApenasNumerosDaData(usuario.birthDate);

        const user = {
          birthDate: usuario.birthDate,
          email: usuario.email,
          registration: usuario.registration.toString(),
          firstLogin: true,
          isAdmin: usuario.isAdmin,
          isDeleted: false,
          lastLoginAt: '',
          deletedAt: '',
          updatedAt: '',
          uid: '',
        };

        this.db.list(this.dbPath).push(user);
        return Promise.resolve();
      })
      .catch((error) => {
        console.log('>>>>  erro', error);
        return Promise.reject(error);
      });
  }

  // busca um usuário com base em sua matrícula, caso não seja encontrado um usuário a promessa é resolvida (não existe um usuário com a matricula informada, logo ela está apta para uso)
  async verificarExistencia(matricula: string) {
    return this.buscarUsuario('registration', matricula)
      .then((user) => {
        if (matricula === user.registration) {
          // console.log('Matrícula já UTILIZADA');
          return Promise.reject('Matrícula já utilizada');
        }
      })
      .catch((error) => {
        if (error == 'Usuário não encontrado') {
          // console.log('MATRÍCULA DISPONÍVEL PARA USO!');
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      });
  }

  async atualizarPerfil(usuario: Usuario, credenciaisLogin: Login) {
    await this.validarAtualizacao(usuario).catch((error) => {
      return Promise.reject(error);
    });

    return this.afAuth
      .signInWithEmailAndPassword(
        credenciaisLogin.email,
        credenciaisLogin.password
      )
      .then((userCredential) => {
        if (usuario.email != credenciaisLogin.email) {
          userCredential.user.updateEmail(usuario.email);
        }

        if (usuario.password != '' && usuario.password != undefined) {
          userCredential.user.updatePassword(usuario.password);
        }

        const user = {
          birthDate: moment(usuario.birthDate).format('DD/MM/YYYY'),
          email: usuario.email,
          registration: usuario.registration.toString(),
          isAdmin: usuario.isAdmin,
          updatedAt: new Date(),
        };

        usuario.birthDate = this.obterApenasNumerosDaData(usuario.birthDate);

        localStorage.setItem('user', JSON.stringify(usuario));

        this.db.list(this.dbPath).update(usuario.key, user);
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil atualizado!',
        });

        location.reload(); // para atualizar a matricula presente no menu e a data do date-picker
      })
      .catch((erro) => {
        if (erro.code === 'auth/too-many-requests') {
          this.messageService.add({
            severity: 'error',
            summary:
              'Conta temporariamente desativada devido a muitas tentativas de login malsucedidas.',
            detail: ' Tente novamente mais tarde!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'A senha informada está incorreta!.',
          });
        }
      });
  }

  async atualizar(usuario: Usuario) {
    await this.validarAtualizacao(usuario).catch((error) => {
      return Promise.reject(error);
    });

    const user = {
      birthDate: moment(usuario.birthDate).format('DD/MM/YYYY'),
      registration: usuario.registration.toString(),
      isAdmin: usuario.isAdmin,
      updatedAt: new Date(),
    };

    return this.db.list(this.dbPath).update(usuario.key, user);
  }

  async validarAtualizacao(usuario: Usuario) {
    await this.buscarUsuario('registration', usuario.registration)
      .then((u) => {
        if (u.key != usuario.key) {
          // visto que o usuário encontrado NÃO é o proprietário da matrícula informada (key divergente), a atualização é interrompida
          return Promise.reject('Matrícula já utilizada');
        }
        // visto que o usuário encontrado é o proprietário da matrícula informada, a atualização segue normalmente
      })
      .catch((erro) => {
        // visto que não foi encontrado nenhum usuário para a matrícula informada, a atualização segue normalmente
        if (erro != 'Usuário não encontrado') return Promise.reject(erro);
      });
  }

  atualizarFirstLogin(key: string) {
    const user = {
      firstLogin: false,
    };

    return this.db.list(this.dbPath).update(key, user);
  }

  atualizarUid(key: string, uid: string) {
    const user = {
      uid: uid,
    };

    return this.db.list(this.dbPath).update(key, user);
  }

  async criarUsuarioFirstLogin(key: string, email: string, senha: string) {
    try {
      const credenciais = await this.afAuth.createUserWithEmailAndPassword(
        email,
        senha
      );

      this.atualizarFirstLogin(key);
      this.atualizarUid(key, credenciais.user.uid);

      this.buscarUsuario('email', email).then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
      });
    } catch (err) {
      console.log(err);
    }
  }

  // listando com base na estratégia de paginação adotada
  listar(numberItems, startKey?): AngularFireList<Usuario[]> {
    return this.db.list(this.dbPath, (ref) => {
      var query = ref.orderByKey().limitToFirst(numberItems + 1); // limitToFirst começa a partir do topo da coleção

      if (startKey) {
        // Se não houver cursor, começa no início da coleção ... caso contrário, começa no cursor
        query = query.startAt(startKey);
      }

      return query;
    });
  }

  // get all
  getUsuarios() {
    return this.db
      .list('users')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.exportVal(),
          }))
        )
      );
  }

  private queryBuscarUsuario(propriedade: string, valor: string) {
    return this.db.list(this.dbPath, (ref) => {
      return ref.orderByChild(propriedade).equalTo(valor);
    });
  }

  buscarUsuario(propriedade: string, valor: string): Promise<Usuario> {
    return new Promise<Usuario>((resolve, reject) => {
      this.queryBuscarUsuario(propriedade, valor)
        .snapshotChanges()
        .subscribe((searchedUser) => {
          if (searchedUser.length === 0) {
            reject('Usuário não encontrado');
          } else {
            const user = {
              key: searchedUser[0].payload.key,
              ...searchedUser[0].payload.exportVal(),
            };
            user.birthDate = moment(user.birthDate, 'DD-MM-YYYY').toDate();
            resolve(user);
          }
        });
    });
  }

  excluir(key: string) {
    const user = {
      isDeleted: true,
      deletedAt: new Date(),
    };

    return this.db.list(this.dbPath).update(key, user);
  }

  enviarEmailParaResetarSenha(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  validarDominioDeEmail(email: string) {
    return email.endsWith('@bombeirospb.gov');
  }

  obterApenasNumerosDaData(data: Date) {
    let dataFormatada = moment(data).format('DD/MM/YYYY');
    return dataFormatada.replace(/[^0-9]/g, '');
  }
}
