import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ThemeService } from 'src/app/shared/theme.service';

import { AuthService } from './../../seguranca/auth.service';
import { UsuarioService } from './../../usuarios/usuario.service';
import { Usuario } from './../model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibeMenu = false;

  usuarioLogado: Usuario;

  darkThemeisActive: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {

    this.usuarioLogado = new Usuario();

    if (this.auth.getUsuarioLogado) {
      this.buscarUsuario(this.auth.getUsuarioLogado.uid);
    }



  }

  logout() {
    this.auth.deslogar();
    this.router.navigate(['/login']);
    this.messageService.add({ severity: 'success', summary: 'Você saiu!' });
  }

  omitir() {
    this.exibeMenu = !this.exibeMenu;
  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuarioLogado = user;
      })
  }

  changeTheme() {

    let theme: string;

    if (this.darkThemeisActive) {
      theme = 'dark'
    } else {
      theme = 'light'
    }

    this.themeService.switchTheme(theme);

  }





}
