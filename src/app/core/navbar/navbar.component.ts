import { Usuario } from './../model';
import { UsuarioService } from './../../usuarios/usuario.service';
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

  usuarioLogado: Usuario;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private usuarioService: UsuarioService
    ) { }

  ngOnInit(): void {

    this.usuarioLogado = new Usuario();

    if(this.auth.usuarioLogado){
      // console.log('nome menu - :', this.auth.usuarioLogado.uid)
      this.buscarUsuario(this.auth.usuarioLogado.uid);
    }


  }


  logout() {
    this.auth.deslogar();
    this.router.navigate(['/login']);
    this.messageService.add({severity:'success', summary:'Você saiu!'});
  }

  omitir() {
    this.exibindoMenu = !this.exibindoMenu;
  }

  // método duplicado em usuario-cadastro e perfil component
  buscarUsuario(key: string) {
  this.usuarioService.listar()
  .subscribe(users => {

    let flag = false;

    users.forEach(user => {
      if(user.uid === key) {
        this.usuarioLogado = user;
        flag = true;
      }
    })

    if(!flag){
      this.messageService.add({severity:'error', summary: 'Usuário não encontrado.'});
    }

  }, (error) => {
    console.log(error);
  });

}






}
