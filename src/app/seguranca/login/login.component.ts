import { UsuarioService } from './../../usuarios/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {MessageService} from 'primeng/api';

import { AuthService } from '../auth.service';
import { Login } from 'src/app/core/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  login = new Login();


  dialogIsVisible: boolean = false;
  emailEsqueciMinhaSenha: string = '';


  constructor(
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
    ) { }

  logar(){
    this.auth.logar(this.login.email, this.login.senha)
    .then(() => {
      this.router.navigate(['/home']);
      this.messageService.add({severity:'success', summary:'Você entrou!'});
    })
    .catch(erro => {
      this.messageService.add({severity:'error', summary:'Nenhum usuário foi encontrado com essas credenciais!'});
    })
  }



  enviarEmailDeSenhaEsquecida(form: FormControl) {
    this.usuarioService.resetarSenha(this.emailEsqueciMinhaSenha)
    .then(() => {
      this.messageService.add({severity:'success', summary:'Instruções para redefinir sua senha foram envidas para seu email!'});
      this.dialogIsVisible = false;
      form.reset();
      this.emailEsqueciMinhaSenha = '';
    })
    .catch(erro => {
      if(erro.code == 'auth/invalid-email') {
        this.messageService.add({severity:'error', summary: 'O e-mail está formatado incorretamente.'});
      }else if(erro.code == 'auth/user-not-found'){
        this.messageService.add({severity:'error', summary:'Nenhum usuário foi encontrado com esse e-mail!'});
      }
    })
  }


}
