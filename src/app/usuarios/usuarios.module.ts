import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';

import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosNovaSenhaComponent } from './usuarios-nova-senha/usuarios-nova-senha.component';
import { RippleModule } from 'primeng/ripple';

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
    RippleModule,
    ProgressSpinnerModule
  ]
})
export class UsuariosModule { }
