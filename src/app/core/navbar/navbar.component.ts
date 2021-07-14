import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  usuarioLogado: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.usuarioLogado = this.auth.usuarioLogado;
    if(this.usuarioLogado == undefined) {
      this.usuarioLogado = new Object();
    }
  }


  logout() {
    this.auth.deslogar();
    this.router.navigate(['/login']);
    this.messageService.add({severity:'success', summary:'Você saiu!'});
  }

}
