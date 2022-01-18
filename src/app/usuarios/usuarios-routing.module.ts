import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosNovaSenhaComponent } from './usuarios-nova-senha/usuarios-nova-senha.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [

  { path: '', component: UsuariosPesquisaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'novo', component: UsuariosCadastroComponent },
  { path: 'edicao/:matricula', component: UsuariosCadastroComponent },
  { path: 'nova-senha', component: UsuariosNovaSenhaComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
