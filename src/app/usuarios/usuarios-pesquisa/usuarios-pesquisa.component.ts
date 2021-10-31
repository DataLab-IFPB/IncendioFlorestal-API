import { Usuario } from './../../core/model';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import { UsuarioService } from './../usuario.service';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css']
})
export class UsuariosPesquisaComponent implements OnInit {

  usuario: Usuario;

  usuarios: Array<Usuario> = [];

  busca: string = '';

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

        const usuariosFlag: Array<Usuario> = [];

        users.forEach(u => {
          if (!u.isExcluido) {
            usuariosFlag.push(u);
          }
        })

        this.usuarios = usuariosFlag;

      }, (error) => {
        console.log(error);
      });
  }

  excluir(key: string) {

    this.usuarioService.excluir(key)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Usuário excluído!' });
      })
      .catch(error => {
        this.messageService.add({ severity: 'error', summary: error });
      })

  }

  confirmarExclusao(usuario: Usuario) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza que deseja excluir esse usuário?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.excluir(usuario.key);
      }
    });
  }

  filtrar() {

    this.usuarioService.listar()
      .subscribe(users => {

        const usuariosFlag: Array<Usuario> = [];

        users.forEach(u => {
          if (!u.isExcluido) {
            const email = String(u.email);
            const registration = String(u.registration);

            if (email.includes(this.busca) || registration.includes(this.busca)) {
              usuariosFlag.push(u);
            }
          }
        })

        this.usuarios = usuariosFlag;

      }, (error) => {
        console.log(error);
      });

  }





}
