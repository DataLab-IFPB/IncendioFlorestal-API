import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [ PaginaNaoEncontradaComponent, NavbarComponent ],
  imports: [
    CommonModule,

    RouterModule,
    TooltipModule
  ],
  exports: [ NavbarComponent]
})
export class CoreModule { }
