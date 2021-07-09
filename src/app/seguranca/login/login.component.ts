import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {MessageService} from 'primeng/api';
import { Login } from 'src/app/core/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  login = new Login();

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
    ) { }

  async logar(){

    await this.auth.logar(this.login.email, this.login.senha)
    .then(() => {
      this.router.navigate(['/home']);
      this.messageService.add({severity:'success', summary:'Você entrou!'});
    })
    .catch(erro => {
      this.messageService.add({severity:'error', summary:'Nenhum usuário foi encontrado com essas credenciais!'});
    })
  }


}
