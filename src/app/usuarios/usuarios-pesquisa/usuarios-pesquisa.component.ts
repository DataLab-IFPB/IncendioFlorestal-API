import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import 'rxjs/add/operator/map';
import * as ARR from 'lodash';

import { Usuario } from '../usuario';
import { UsuarioService } from './../usuario.service';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css'],
})
export class UsuariosPesquisaComponent implements OnInit {
  usuario: Usuario;

  spinnerIsActive = true;

  busca: string = '';

  usuarios: Array<Usuario> = [];

  numberItems = 28;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(key?) {
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.usuarioService
      .listar(this.numberItems, key)
      .snapshotChanges()
      .subscribe(async (usuarios) => {
        const usuariosFlag = [];

        // for utilizado para verificar se está exluido (todo: tentar remover isso e deixer por conta da query)
        for await (let contents of usuarios) {
          const user = {
            key: contents.payload.key,
            ...contents.payload.exportVal(),
          };
          if (!user.isDeleted) {
            usuariosFlag.push(user);
          }
        }

        this.usuarios = ARR.slice(usuariosFlag, 0, this.numberItems); // elimina o último incêndio (ele é a próxima key)
        this.nextKey = ARR.get(usuarios[this.numberItems], 'key');

        this.stopSpinner();
      });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.usuarios)['key']); // get prev key
    this.listar(this.nextKey);
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys); // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys); // delete last key

    this.listar(prevKey);
  }

  stopSpinner() {
    this.spinnerIsActive = false;
  }

  filtrar() {
    if (this.busca == '') {
      this.usuarios = [];
      this.spinnerIsActive = true;
      this.listar();
    } else {
      this.usuarioService.getUsuarios().subscribe(
        (users) => {
          const usuariosFlag: Array<Usuario> = [];

          users.forEach((u) => {
            if (!u.isDeleted) {
              const email = String(u.email);
              const registration = String(u.registration);

              if (
                email.includes(this.busca) ||
                registration.includes(this.busca)
              ) {
                usuariosFlag.push(u);
              }
            }
          });

          this.usuarios = usuariosFlag;

          this.nextKey = undefined;
          this.prevKeys = [];

          this.stopSpinner();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  excluir(key: string) {
    this.usuarioService
      .excluir(key)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuário excluído!',
        });
      })
      .catch((error) => {
        this.messageService.add({ severity: 'error', summary: error });
      });
  }

  confirmarExclusao(usuario: Usuario) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza que deseja excluir esse usuário?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.excluir(usuario.key);
      },
    });
  }
}
