import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';

import { NavbarComponent } from './navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';


@NgModule({
  declarations: [PaginaNaoEncontradaComponent, NavbarComponent],
  imports: [
    CommonModule,

    RouterModule,
    TooltipModule,
    SidebarModule,
    InputSwitchModule,
    FormsModule
  ],
  exports: [NavbarComponent]
})
export class CoreModule { }
