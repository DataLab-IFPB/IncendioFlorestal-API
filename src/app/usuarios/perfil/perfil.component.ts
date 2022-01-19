import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

import * as moment from 'moment';

import { UsuarioService } from './../usuario.service';

import { AuthService } from 'src/app/seguranca/auth.service';

import { Usuario } from '../usuario';
import { Login } from 'src/app/seguranca/seguranca';
import { DatePickerComponent } from './../../shared/component/date-picker/date-picker.component';
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

  @ViewChild('dataNascimento') customDatePicker: DatePickerComponent;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {

    if (this.auth.getUsuarioLogado.uid) {
      this.email = this.auth.getUsuarioLogado.email;
      this.buscarUsuario(this.auth.getUsuarioLogado.uid);
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
    credenciais.password = this.confirmacaoDeSenha;

    this.usuario.email = this.usuario.registration + "@bombeirospb.gov";

    const dataNascimento = this.customDatePicker.selectedDate;
    this.usuario.birthDate = moment(dataNascimento).format('DD/MM/YYYY')

    this.usuarioService.atualizarPerfil(this.usuario, credenciais)
      .then(() => {

        this.email = this.auth.getUsuarioLogado.email;

      })
      .catch(erro => {
        if (erro == 'Matrícula já utilizada') {
          this.messageService.add({ severity: 'error', summary: 'Matrícula já utilizada!' });
        }
      })

    this.resetarConfirmacaoDeSenha();


  }

  buscarUsuario(uid: string) {
    this.usuarioService.buscarUsuarioPorUid(uid)
      .then(user => {
        this.usuario = user;
      })
  }


  resetarConfirmacaoDeSenha() {
    this.confirmacaoDeSenha = '';
  }




}
