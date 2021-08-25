import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { AuthService } from './../../seguranca/auth.service';
import { UsuarioService } from './../../usuarios/usuario.service';
import { Usuario } from './../model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  usuarioLogado: Usuario;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {

    this.usuarioLogado = new Usuario();

    if (this.auth.usuarioLogado) {
      this.buscarUsuario(this.auth.usuarioLogado.uid);
    }
  }

  logout() {
    this.auth.deslogar();
    this.router.navigate(['/login']);
    this.messageService.add({ severity: 'success', summary: 'Você saiu!' });
  }

  omitir() {
    this.exibindoMenu = !this.exibindoMenu;
  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuarioLogado = user;
      })
  }






}
