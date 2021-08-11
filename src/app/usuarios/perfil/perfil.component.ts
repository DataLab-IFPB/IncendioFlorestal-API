import { AngularFireAuth } from '@angular/fire/auth';
import { Login, Usuario } from './../../core/model';
import { MessageService } from 'primeng/api';
import { UsuarioService } from './../usuario.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/seguranca/auth.service';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {



  usuario = new Usuario();

  userOptions: any[];

  dialogIsVisible: boolean = false;

  confirmacaoDeSenha: string = '';
  email: string;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {

    if (this.auth.usuarioLogado.uid) {
      this.email = this.auth.usuarioLogado.email;
      this.buscarUsuario(this.auth.usuarioLogado.uid);
    } else {
      this.usuario = new Usuario();
    }


    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  salvar() {

    const credenciais = new Login();
    credenciais.email = this.email;
    credenciais.senha = this.confirmacaoDeSenha;


    // matricula deve ser única !
    this.usuarioService.atualizarPerfil(this.usuario, credenciais)
      .then(() => {
        // this.router.navigate(['/usuarios']);
        this.confirmacaoDeSenha = '';
        this.email = this.auth.getUsuarioLogado.email;
      })
      .catch(erro => {
        this.messageService.add({ severity: 'error', summary: erro });
        // console.log('------------------------------------------ erro no salvar')
      })

  }

  // método duplicado em usuario-cadastro component
  buscarUsuario(uid: string) {

    this.usuarioService.listar()
      .subscribe(users => {

        let flag = false;

        users.forEach(user => {
          if (user.uid === uid) {
            this.usuario = user;
            flag = true;
          }
        })

        if (!flag) {
          this.messageService.add({ severity: 'error', summary: 'Usuário não encontrado.' });
        }

      }, (error) => {
        console.log(error);
      });

  }




}
