import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from 'src/app/seguranca/auth.service';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-usuarios-nova-senha',
  templateUrl: './usuarios-nova-senha.component.html',
  styleUrls: ['./usuarios-nova-senha.component.css'],
})
export class UsuariosNovaSenhaComponent implements OnInit {
  usuario = new Usuario();

  novaSenha: string;
  confirmacaoNovaSenha: string;
  confirmacaoDeSenhaAntiga: string;

  email: string;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioLogado;
    this.email = this.usuario.email;
  }

  validaCompatibilidade() {
    if (this.novaSenha === this.confirmacaoNovaSenha) {
      this.confirmarTrocaDeSenha(this.usuario);
    } else {
      this.toastService.showMessage(
        'error',
        'As senhas informadas não são compatíveis!'
      );
    }
  }

  salvar(usuario: Usuario) {
    usuario.password = this.confirmacaoNovaSenha;

    this.usuarioService
      .criarUsuarioFirstLogin(usuario.key, usuario.email, usuario.password)
      .then(() => {
        this.toastService.showMessage('success', 'Senha atualizada!');
        this.router.navigate(['/home']);
      });
  }

  resetarConfirmacaoDeSenha() {
    this.confirmacaoDeSenhaAntiga = '';
  }

  confirmarTrocaDeSenha(usuario: Usuario) {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Você tem certeza?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.salvar(usuario);
      },
    });
  }
}
