import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'combate-incendios';

  constructor(
    private router: Router) {
    this.definirTemaPadrao();
  }

  exibindoMenu() {

    const url = this.router.url;

    if (url.includes('/login')
      || url.includes('/pagina-nao-encontrada')
      || url.includes('/usuario/nova-senha')) {

      return false;
    } else {
      return true;
    }

  }


  definirTemaPadrao() {

    const theme = localStorage.getItem('theme');

    if (!theme) {
      localStorage.setItem('theme', 'light');
    }

  }








}
