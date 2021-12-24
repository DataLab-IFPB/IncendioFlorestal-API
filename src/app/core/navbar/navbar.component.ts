import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ThemeService } from 'src/app/shared/theme.service';

import { AuthService } from './../../seguranca/auth.service';
import { UsuarioService } from './../../usuarios/usuario.service';
import { Usuario } from './../model';

import { faFireExtinguisher } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibeMenu = false;

  usuarioLogado: Usuario;

  darkThemeisActive: boolean = false;

  icones = {
    extintor: faFireExtinguisher
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {

    const currentTheme = this.initTheme();

    if (currentTheme == "dark")
      this.darkThemeisActive = true;


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


  initTheme() {
    const theme = localStorage.getItem('theme');
    this.themeService.switchTheme(theme);
    return theme;
  }

  changeTheme() {

    localStorage.removeItem('theme');

    let theme: string;

    if (this.darkThemeisActive) {
      localStorage.setItem('theme', 'dark');
      theme = 'dark'
    } else {
      localStorage.setItem('theme', 'light');
      theme = 'light'
    }

    this.themeService.switchTheme(theme);

  }

}
