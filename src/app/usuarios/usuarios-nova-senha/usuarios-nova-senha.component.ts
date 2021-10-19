import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/seguranca/auth.service';
import { UsuarioService } from '../usuario.service';

import { Router } from '@angular/router';

import { Login, Usuario } from './../../core/model';

@Component({
  selector: 'app-usuarios-nova-senha',
  templateUrl: './usuarios-nova-senha.component.html',
  styleUrls: ['./usuarios-nova-senha.component.css']
})
export class UsuariosNovaSenhaComponent implements OnInit {


  usuario = new Usuario();

  dialogIsVisible: boolean = false;

  novaSenha: string;
  confirmacaoNovaSenha: string;
  confirmacaoDeSenhaAntiga: string;

  email: string;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (this.auth.getUsuarioLogado.uid) {
      this.email = this.auth.getUsuarioLogado.email;
      this.buscarUsuario(this.auth.getUsuarioLogado.uid);
    } else {
      this.usuario = new Usuario();
    }

  }

  validaCompatibilidade() {
    if (this.novaSenha === this.confirmacaoNovaSenha) {
      this.dialogIsVisible = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'As senhas informadas não são compatíveis!' });
    }
  }

  salvar() {
    const credenciais = new Login();
    credenciais.email = this.email;
    credenciais.password = this.confirmacaoDeSenhaAntiga;

    this.usuario.password = this.confirmacaoNovaSenha;

    this.usuarioService.atualizarSenha(this.usuario, credenciais)
      .then(() => {
        this.confirmacaoDeSenhaAntiga = '';
      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: 'A senha informada está incorreta!.' });
      })

  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuario = user;
      })
  }


}
