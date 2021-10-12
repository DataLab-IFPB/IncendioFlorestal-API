import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { UsuarioService } from './../usuario.service';
import { Usuario } from 'src/app/core/model';

import * as moment from 'moment';
@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.css']
})
export class UsuariosCadastroComponent implements OnInit {

  usuario = new Usuario();

  userOptions: any[];

  anoAtual = new Date().getFullYear();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit(): void {

    const keyUsuario = this.route.snapshot.params['keyUsuario'];

    if (keyUsuario) {
      this.buscarUsuario(keyUsuario);
    }

    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  get editando() {
    return Boolean(this.usuario.uid);
  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuario = user;
      })
  }

  salvar() {

    if (this.usuarioService.validarDominioDeEmail(this.usuario.email)) {
      this.editando ? this.atualizar : this.cadastrar();
    } else {
      this.messageService.add({ severity: 'error', summary: 'O e-mail não está formatado corretamente.' });
    }

  }

  cadastrar() {
    this.usuario.birthDate = moment(this.usuario.birthDate).format('DD/MM/YYYY');
    this.usuario.password = this.usuario.birthDate.replace(/[^0-9]/g, '');

    // matricula deve ser única!
    this.usuarioService.cadastrar(this.usuario)
      .then(() => {
        this.router.navigate(['/usuarios']);
        this.messageService.add({ severity: 'success', summary: 'Usuário cadastrado!' });
      })
      .catch(erro => {
        if (erro.code == 'auth/invalid-email') {
          this.messageService.add({ severity: 'error', summary: 'O e-mail não está formatado corretamente.' });
        } else if (erro.code == 'auth/email-already-in-use') {
          this.messageService.add({ severity: 'error', summary: 'O e-mail já está sendo utilizado.' });
        }
      })
  }

  atualizar() {
    // matricula deve ser única !
    this.usuarioService.atualizar(this.usuario)
      .then(() => {
        this.router.navigate(['/usuarios']);
        this.messageService.add({ severity: 'success', summary: 'Usuário atualizado!' });
      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: erro });
      })
  }

  goBack() {
    this.location.back();
  }

}
