import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from './../../core/model';
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


  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {

    if(this.auth.usuarioLogado.uid){
      this.buscarUsuario(this.auth.usuarioLogado.uid);
    }else {
      this.usuario = new Usuario();
    }


    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  salvar() {

    // matricula deve ser única !
    this.usuarioService.atualizar(this.usuario)
    .then(() => {
      // this.router.navigate(['/usuarios']);
      this.messageService.add({severity:'success', summary:'Perfil atualizado!'});
      // location.reload();
    })
    .catch(erro => {
        this.messageService.add({severity:'error', summary: erro});
    })

  }

  // método duplicado em usuario-cadastro component
  buscarUsuario(key: string) {
    this.usuarioService.listar()
    .subscribe(users => {

      let flag = false;

      users.forEach(user => {
        if(user.uid === key) {
          this.usuario = user;
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
