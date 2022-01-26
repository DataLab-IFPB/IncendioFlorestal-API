import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { AuthService } from '../auth.service';
import { Login } from '../seguranca';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login = new Login();

  dialogIsVisible: boolean = false;
  emailEsqueciMinhaSenha: string = '';

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService
  ) {}

  logar() {
    this.auth
      .logar(this.login.email, this.login.password)
      .then(() => {
        this.router.navigate(['/home']);
        this.messageService.add({
          severity: 'success',
          summary: 'Você entrou!',
        });
      })
      .catch((erro) => {
        if (erro === 'E-mail inválido') {
          this.messageService.add({
            severity: 'error',
            summary: 'O e-mail não está formatado corretamente.',
          });
        } else if (erro === 'Conta bloqueada') {
          this.messageService.add({
            severity: 'error',
            summary:
              'Conta temporariamente desativada devido a muitas tentativas de login malsucedidas.',
            detail: ' Tente novamente mais tarde!',
          });
        } else if (
          erro === 'Usuário não encontrado' ||
          erro === 'Usuário deletado' ||
          erro === 'Credenciais inválidas'
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Nenhum usuário foi encontrado com essas credenciais!',
          });
        }
      });
  }

  enviarEmailDeSenhaEsquecida(form: FormControl) {
    this.usuarioService
      .enviarEmailParaResetarSenha(this.emailEsqueciMinhaSenha)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary:
            'Instruções para redefinir sua senha foram envidas para seu email!',
        });
        this.dialogIsVisible = false;
        form.reset();
        this.emailEsqueciMinhaSenha = '';
      })
      .catch((erro) => {
        if (erro.code == 'auth/invalid-email') {
          this.messageService.add({
            severity: 'error',
            summary: 'O e-mail está formatado incorretamente.',
          });
        } else if (erro.code == 'auth/user-not-found') {
          this.messageService.add({
            severity: 'error',
            summary: 'Nenhum usuário foi encontrado com esse e-mail!',
          });
        }
      });
  }
}
