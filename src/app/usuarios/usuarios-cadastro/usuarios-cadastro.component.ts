import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from './../usuario.service';
import { Usuario } from '../usuario';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.css'],
})
export class UsuariosCadastroComponent implements OnInit {
  usuario = new Usuario();

  userOptions: any[];

  matricula = this.route.snapshot.params['matricula'];

  anoAtual = new Date().getFullYear();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.matricula) {
      this.buscarUsuario(this.matricula);
    }

    this.userOptions = [
      { label: 'Não', value: false },
      { label: 'Sim', value: true },
    ];
  }

  get editando() {
    return this.matricula ? true : false;
  }

  // buscando usuário por matrícula para tratar o caso em que um usuário com estado de firstLogin (não possui uid) é editado
  buscarUsuario(matricula: string) {
    this.usuarioService
      .buscarUsuario('registration', matricula)
      .then((user) => {
        this.usuario = user;
      })
      .catch((erro) => {
        this.toastService.showMessage('error', 'Usuário não encontrado!');
        this.router.navigate(['/usuarios']);
      });
  }

  salvar() {
    this.usuario.email = this.usuario.registration + '@bombeirospb.gov';

    if (this.usuarioService.validarDominioDeEmail(this.usuario.email)) {
      this.editando ? this.atualizar() : this.cadastrar();
    } else {
      this.toastService.showMessage(
        'error',
        'O e-mail não está formatado corretamente!'
      );
    }
  }

  cadastrar() {
    this.usuarioService
      .cadastrar(this.usuario)
      .then(() => {
        this.toastService.showMessage('success', 'Usuário cadastrado!');
        this.router.navigate(['/usuarios']);
      })
      .catch((erro) => {
        if (erro == 'Matrícula já utilizada') {
          this.toastService.showMessage('error', 'Matrícula já utilizada!');
        } else {
          this.toastService.showMessage('error', erro);
        }
      });
  }

  atualizar() {
    this.usuarioService
      .atualizar(this.usuario)
      .then(() => {
        this.toastService.showMessage('success', 'Usuário atualizado!');
        this.router.navigate(['/usuarios']);
      })
      .catch((erro) => {
        if (erro == 'Matrícula já utilizada') {
          this.toastService.showMessage('error', 'Matrícula já utilizada!');
        } else {
          this.toastService.showMessage('error', erro);
        }
      });
  }

  goBack() {
    this.location.back();
  }
}
