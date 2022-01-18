import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { AuthService } from 'src/app/seguranca/auth.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { UsuarioService } from './../../usuarios/usuario.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuarioLogado: Usuario;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarUsuario(this.auth.getUsuarioLogado.uid);
  }


  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuarioLogado = user;
        this.alertaPrimeiroLogin();
      })
  }


  alertaPrimeiroLogin() {
    if (this.usuarioLogado.firstLogin) {
      this.confirmationService.confirm({
        header: 'Atenção!',
        message: 'Este é o seu primeiro login, por favor altere sua senha.',
        icon: 'pi pi-info-circle',
        key: 'alertaTrocaDeSenha',
        accept: () => {
          this.router.navigate(['/usuarios/nova-senha']);
        }
      });
    }
  }

}
