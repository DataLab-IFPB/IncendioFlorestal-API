import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

import * as moment from 'moment';

import { UsuarioService } from './../usuario.service';

import { AuthService } from 'src/app/seguranca/auth.service';

import { Usuario } from '../usuario';
import { Login } from 'src/app/seguranca/seguranca';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario = new Usuario();

  userOptions: any[] = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

  dialogIsVisible: boolean = false;

  confirmacaoDeSenha: string = '';
  email: string;

  anoAtual = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUsuarioLogado;
    if (user) {
      this.usuario = user;
      this.email = user.email;
      this.usuario.birthDate = moment(user.birthDate, 'DD-MM-YYYY').toDate();
    }
  }

  salvar() {
    const credenciais = new Login();
    credenciais.email = this.email;
    credenciais.password = this.confirmacaoDeSenha;

    this.usuario.email = this.usuario.registration + '@bombeirospb.gov';

    this.usuarioService
      .atualizarPerfil(this.usuario, credenciais)
      .then(() => {
        this.email = this.auth.getUsuarioLogado.email;
      })
      .catch((erro) => {
        if (erro == 'Matrícula já utilizada') {
          this.messageService.add({
            severity: 'error',
            summary: 'Matrícula já utilizada!',
          });
        }
      });

    this.resetarConfirmacaoDeSenha();
  }

  resetarConfirmacaoDeSenha() {
    this.confirmacaoDeSenha = '';
  }
}
