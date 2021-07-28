import { Usuario } from './../../core/model';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import { UsuarioService } from './../usuario.service';

import { map } from 'rxjs/operators';
import * as admin from 'firebase-admin'

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css']
})
export class UsuariosPesquisaComponent implements OnInit {


  usuarios: Array<Usuario> = [];

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {
    this.listar();


  }

  listar() {
    this.usuarioService.listar()
    .subscribe(users => {
      this.usuarios = users;
    }, (error) => {
      console.log(error);
    });
  }


  excluir(key: string, uid: string) {
    // delete user by specify atribute uid
    // ps: delete in realtime and auth users
    this.usuarioService.excluir(key, uid)
    .then(() => {
      this.messageService.add({severity:'success', summary:'Usuário excluído!'});
    })
    .catch(erro => {
        this.messageService.add({severity:'error', summary: erro});
    })
  }


  confirmarExclusao(usuario: Usuario) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza que deseja excluir esse usuário?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // passar os 2 valores
        // this.excluir(usuario.uid);
        this.excluir(usuario.key, usuario.uid);
      }
    });
  }



}
