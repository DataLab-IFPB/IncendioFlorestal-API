import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosNovaSenhaComponent } from './usuarios-nova-senha/usuarios-nova-senha.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from '../seguranca/auth.guard';
import { RoleGuard } from './../seguranca/role.guard';

const routes: Routes = [

  { path: '', component: UsuariosPesquisaComponent, canActivate: [AuthGuard, RoleGuard]  },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'novo', component: UsuariosCadastroComponent, canActivate: [AuthGuard, RoleGuard]  },
  { path: 'edicao/:matricula', component: UsuariosCadastroComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'nova-senha', component: UsuariosNovaSenhaComponent, canActivate: [AuthGuard] },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
