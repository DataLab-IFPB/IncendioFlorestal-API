import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IncendiosCadastroComponent } from './../incendios/incendios-cadastro/incendios-cadastro.component';
import { IncendiosPesquisaComponent } from './../incendios/incendios-pesquisa/incendios-pesquisa.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [

  { path: '', component: IncendiosPesquisaComponent, canActivate: [AuthGuard] },
  { path: 'novo', component: IncendiosCadastroComponent, canActivate: [AuthGuard] },
  { path: 'edicao/:key', component: IncendiosCadastroComponent, canActivate: [AuthGuard] },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncendiosRoutingModule { }
