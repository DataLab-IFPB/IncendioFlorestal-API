import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';

import { SharedModule } from './../shared/shared.module';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosNovaSenhaComponent } from './usuarios-nova-senha/usuarios-nova-senha.component';

@NgModule({
  declarations: [
    UsuariosPesquisaComponent,
    UsuariosCadastroComponent,
    PerfilComponent,
    UsuariosNovaSenhaComponent
  ],
  imports: [
    CommonModule,

    SharedModule,

    RouterModule,

    SelectButtonModule,
    ConfirmDialogModule,
    DialogModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    CalendarModule,
    RippleModule
  ]
})
export class UsuariosModule { }
