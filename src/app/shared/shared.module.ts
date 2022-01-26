import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MensagemDeErroComponent } from './component/mensagem-de-erro/mensagem-de-erro.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './component/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { PanelLoaderComponent } from './component/panel-loader/panel-loader.component';

const angularModules: any = [CommonModule, RouterModule, FormsModule];

const primeModules: any = [
  TooltipModule,
  SidebarModule,
  InputSwitchModule,
  ProgressSpinnerModule,
  PasswordModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  DataViewModule,
  ConfirmDialogModule,
  DialogModule,
  SelectButtonModule,
  CalendarModule,
  RippleModule,
  TableModule,
  FieldsetModule,
  DropdownModule,
  ToastModule,
];

@NgModule({
  declarations: [
    MensagemDeErroComponent,
    PaginaNaoEncontradaComponent,
    NavbarComponent,
    PanelLoaderComponent,
  ],
  imports: [angularModules, primeModules, FontAwesomeModule],
  exports: [
    angularModules,
    primeModules,

    FontAwesomeModule,

    MensagemDeErroComponent,
    PaginaNaoEncontradaComponent,
    NavbarComponent,
    PanelLoaderComponent,
  ],
})
export class SharedModule {}
