import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { UsuarioService } from './../usuario.service';
import { Usuario } from '../usuario';
import { DatePickerComponent } from './../../shared/component/date-picker/date-picker.component';

import * as moment from 'moment';
@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.css']
})
export class UsuariosCadastroComponent implements OnInit {

  usuario = new Usuario();

  userOptions: any[];

  matricula = this.route.snapshot.params['matricula'];

  @ViewChild('dataNascimento') customDatePicker: DatePickerComponent;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit(): void {


    if (this.matricula) {
      this.buscarUsuario(this.matricula);
    }

    this.userOptions = [
      { label: "Não", value: false },
      { label: "Sim", value: true }
    ];

  }

  get editando() {
    return this.matricula ? true : false;
  }


  buscarUsuario(matricula: string) {
    this.usuarioService.buscarUsuarioPorMatricula(matricula)
      .then(user => {
        this.usuario = user;
      })
  }

  salvar() {
    this.usuario.email = this.usuario.registration + "@bombeirospb.gov";

    const dataNascimento = this.customDatePicker.selectedDate;
    this.usuario.birthDate = moment(dataNascimento).format('DD/MM/YYYY')

    if (this.usuarioService.validarDominioDeEmail(this.usuario.email)) {
      this.editando ? this.atualizar() : this.cadastrar();
    } else {
      this.messageService.add({ severity: 'error', summary: 'O e-mail não está formatado corretamente.' });
    }

  }

  cadastrar() {
    this.usuarioService.cadastrar(this.usuario)
      .then(() => {
        this.router.navigate(['/usuarios']);
        this.messageService.add({ severity: 'success', summary: 'Usuário cadastrado!' });
      })
      .catch(erro => {
        if (erro == 'Matrícula já utilizada') {
          this.messageService.add({ severity: 'error', summary: 'Matrícula já utilizada!' });
        } else {
          this.messageService.add({ severity: 'error', summary: erro });
        }
      })
  }

  atualizar() {
    this.usuarioService.atualizar(this.usuario)
      .then(() => {
        this.router.navigate(['/usuarios']);
        this.messageService.add({ severity: 'success', summary: 'Usuário atualizado!' });
      })
      .catch(erro => {
        if (erro == 'Matrícula já utilizada') {
          this.messageService.add({ severity: 'error', summary: 'Matrícula já utilizada!' });
        } else {
          this.messageService.add({ severity: 'error', summary: erro });
        }
      })
  }

  goBack() {
    this.location.back();
  }

}
