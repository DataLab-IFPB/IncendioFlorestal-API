import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';

import { SharedModule } from './../shared/shared.module';
import { IncendiosPesquisaComponent } from './incendios-pesquisa/incendios-pesquisa.component';
import { IncendiosCadastroComponent } from './incendios-cadastro/incendios-cadastro.component';

@NgModule({
  declarations: [

    IncendiosPesquisaComponent,
    IncendiosCadastroComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RippleModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    CardModule,
    CalendarModule,
    FieldsetModule
  ]
})
export class IncendiosModule { }
