import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from 'src/app/seguranca/auth.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { UsuarioService } from './../../usuarios/usuario.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usuarioLogado: Usuario;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buscarUsuario(this.auth.getUsuarioLogado.registration);
  }

  // buscando usuário para atualizar o objeto quando vindo da tela de redefinição de senha (firstLogin)
  buscarUsuario(matricula: string) {
    this.usuarioService
      .buscarUsuario('registration', matricula)
      .then((user) => {
        this.usuarioLogado = user;
        if (user.firstLogin) this.exibirAlertaPrimeiroLogin();
      });
  }

  exibirAlertaPrimeiroLogin() {
    this.confirmationService.confirm({
      header: 'Atenção!',
      message: 'Este é o seu primeiro login, por favor altere sua senha.',
      icon: 'pi pi-info-circle',
      key: 'alertaTrocaDeSenha',
      accept: () => {
        this.router.navigate(['/usuarios/nova-senha']);
      },
    });
  }
}
