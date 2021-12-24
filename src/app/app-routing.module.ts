import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { UsuariosCadastroComponent } from './usuarios/usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios/usuarios-pesquisa/usuarios-pesquisa.component';
import { IncendiosCadastroComponent } from './incendios/incendios-cadastro/incendios-cadastro.component';
import { IncendiosPesquisaComponent } from './incendios/incendios-pesquisa/incendios-pesquisa.component';
import { UsuariosNovaSenhaComponent } from './usuarios/usuarios-nova-senha/usuarios-nova-senha.component';
import { HomeComponent } from './home/home/home.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { LoginComponent } from './seguranca/login/login.component';
import { AuthGuard } from './seguranca/auth.guard';
import { RoleGuard } from './seguranca/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },

  { path: 'usuarios', component: UsuariosPesquisaComponent, canActivate: [] },
  { path: 'usuarios/novo', component: UsuariosCadastroComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'usuarios/edicao/:matricula', component: UsuariosCadastroComponent, canActivate: [] },
  { path: 'usuario/nova-senha', component: UsuariosNovaSenhaComponent, canActivate: [AuthGuard] },

  { path: 'incendios', component: IncendiosPesquisaComponent, canActivate: [AuthGuard] },
  { path: 'incendios/novo', component: IncendiosCadastroComponent, canActivate: [AuthGuard] },
  { path: 'incendios/edicao/:key', component: IncendiosCadastroComponent, canActivate: [AuthGuard] },

  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [RouterModule]

})
export class AppRoutingModule {



}
