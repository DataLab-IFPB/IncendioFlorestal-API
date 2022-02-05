import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { AuthService } from '../auth.service';
import { Login } from '../seguranca';
import { ToastService } from 'src/app/shared/service/toast.service';

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
    private toastService: ToastService
  ) {}

  logar() {
    this.auth
      .logar(this.login.email, this.login.password)
      .then(() => {
        this.toastService.showMessage('success', 'Você entrou!');
        this.router.navigate(['/home']);
      })
      .catch((erro) => {
        if (erro === 'E-mail inválido') {
          this.toastService.showMessage(
            'error',
            'O e-mail não está formatado corretamente!'
          );
        } else if (erro === 'Conta bloqueada') {
          this.toastService.showMessage(
            'error',
            'Conta temporariamente desativada devido a muitas tentativas de login malsucedidas!',
            'Tente novamente mais tarde.'
          );
        } else if (
          erro === 'Usuário não encontrado' ||
          erro === 'Usuário deletado' ||
          erro === 'Credenciais inválidas'
        ) {
          this.toastService.showMessage(
            'error',
            'Nenhum usuário foi encontrado com essas credenciais!'
          );
        }
      });
  }

  enviarEmailDeSenhaEsquecida(form: FormControl) {
    this.usuarioService
      .enviarEmailParaResetarSenha(this.emailEsqueciMinhaSenha)
      .then(() => {
        this.toastService.showMessage(
          'success',
          'Instruções para redefinir sua senha foram envidas para seu email!'
        );

        this.dialogIsVisible = false;
        form.reset();
        this.emailEsqueciMinhaSenha = '';
      })
      .catch((erro) => {
        if (erro.code == 'auth/invalid-email') {
          this.toastService.showMessage(
            'error',
            'O e-mail está formatado incorretamente!'
          );
        } else if (erro.code == 'auth/user-not-found') {
          this.toastService.showMessage(
            'error',
            'Nenhum usuário foi encontrado com esse e-mail!'
          );
        }
      });
  }
}
