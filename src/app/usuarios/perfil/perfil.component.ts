import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';

import { UsuarioService } from './../usuario.service';
import { Login, Usuario } from './../../core/model';
import { AuthService } from 'src/app/seguranca/auth.service';

import * as moment from 'moment';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {



  usuario = new Usuario();

  userOptions: any[];

  dialogIsVisible: boolean = false;

  confirmacaoDeSenha: string = '';
  email: string;


  anoAtual = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {

    if (this.auth.usuarioLogado.uid) {
      this.email = this.auth.usuarioLogado.email;
      this.buscarUsuario(this.auth.usuarioLogado.uid);
    } else {
      this.usuario = new Usuario();
    }


    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  salvar() {

    const credenciais = new Login();
    credenciais.email = this.email;
    credenciais.password = this.confirmacaoDeSenha;


    // matricula deve ser única !
    this.usuarioService.atualizarPerfil(this.usuario, credenciais)
      .then(() => {
        this.confirmacaoDeSenha = '';
        this.email = this.auth.getUsuarioLogado.email;
      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: erro });
      })

  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuario = user;
      })
  }




}
