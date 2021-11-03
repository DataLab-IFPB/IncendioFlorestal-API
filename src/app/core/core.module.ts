import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

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
