import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faFireExtinguisher } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from 'src/app/seguranca/auth.service';
import { UsuarioService } from 'src/app/usuarios/usuario.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { ThemeService } from 'src/app/shared/service/theme.service';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  exibeMenu = false;

  usuarioLogado: Usuario = new Usuario();

  toggleTheme: boolean = false;

  icones = {
    extintor: faFireExtinguisher,
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const currentTheme = this.initTheme();
    if (currentTheme == 'dark') this.toggleTheme = true;

    const user = this.auth.getUsuarioLogado;
    if (user) this.usuarioLogado = user;
  }

  logout() {
    this.toastService.showMessage('success', 'Você saiu!');
    this.auth.deslogar();
    this.router.navigate(['/login']);
  }

  omitirMenu() {
    this.exibeMenu = !this.exibeMenu;
  }

  initTheme() {
    const theme = localStorage.getItem('theme');
    this.themeService.switchTheme(theme);
    return theme;
  }

  changeTheme() {
    let theme: string;
    this.toggleTheme ? (theme = 'dark') : (theme = 'light');
    this.themeService.switchTheme(theme);
  }
}
