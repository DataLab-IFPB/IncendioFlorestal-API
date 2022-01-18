import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IncendiosCadastroComponent } from './../incendios/incendios-cadastro/incendios-cadastro.component';
import { IncendiosPesquisaComponent } from './../incendios/incendios-pesquisa/incendios-pesquisa.component';

const routes: Routes = [

  { path: '', component: IncendiosPesquisaComponent },
  { path: 'novo', component: IncendiosCadastroComponent},
  { path: 'edicao/:key', component: IncendiosCadastroComponent },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncendiosRoutingModule { }
