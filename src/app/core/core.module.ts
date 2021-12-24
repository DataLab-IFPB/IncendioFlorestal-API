import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';

import { NavbarComponent } from './navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';


@NgModule({
  declarations: [PaginaNaoEncontradaComponent, NavbarComponent],
  imports: [
    CommonModule,

    RouterModule,
    TooltipModule,
    SidebarModule,
  ],
  exports: [NavbarComponent]
})
export class CoreModule { }
