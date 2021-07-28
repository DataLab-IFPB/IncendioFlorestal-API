import { MessageService } from 'primeng/api';
import { UsuarioService } from './../usuario.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/core/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.css']
})
export class UsuariosCadastroComponent implements OnInit {

  usuario = new Usuario();

  userOptions: any[];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    const keyUsuario = this.route.snapshot.params['keyUsuario'];

    if (keyUsuario){
      this.buscarUsuario(keyUsuario);
    }

    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  get editando() {
    return Boolean(this.usuario.uid);
  }

  // método duplicado em perfil component
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

    console.log('usuario buscado: ', this.usuario)
  }

  salvar() {

    // this.usuario.isAdmin = this.selectedOption;

    if (this.editando) {
      this.atualizar();
    } else {
      this.cadastrar();
    }

}


  cadastrar() {
    // matricula deve ser única!
    this.usuarioService.cadastrar(this.usuario)
    .then(() => {
      this.router.navigate(['/usuarios']);
      this.messageService.add({severity:'success', summary:'Usuário cadastrado!'});
    })
    .catch(erro => {

      if(erro.code == 'auth/invalid-email') {
        this.messageService.add({severity:'error', summary: 'O e-mail não está formatado corretamente.'});
      }else if(erro.code == 'auth/email-already-in-use') {
        this.messageService.add({severity:'error', summary: 'O e-mail já está sendo utilizado.'});
      }
    })
  }

  atualizar() {
    // matricula deve ser única !
    this.usuarioService.atualizar(this.usuario)
    .then(() => {
      this.router.navigate(['/usuarios']);
      this.messageService.add({severity:'success', summary:'Usuário atualizado!'});
    })
    .catch(erro => {
        this.messageService.add({severity:'error', summary: erro});
    })
  }

}
