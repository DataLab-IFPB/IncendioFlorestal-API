import { IncendiosPesquisaComponent } from './incendios/incendios-pesquisa/incendios-pesquisa.component';
import { UsuariosNovaSenhaComponent } from './usuarios/usuarios-nova-senha/usuarios-nova-senha.component';
import { RoleGuard } from './seguranca/role.guard';
import { HomeComponent } from './home/home/home.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { UsuariosCadastroComponent } from './usuarios/usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios/usuarios-pesquisa/usuarios-pesquisa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './seguranca/auth.guard';
import { LoginComponent } from './seguranca/login/login.component';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },

  { path: 'usuarios', component: UsuariosPesquisaComponent, canActivate: [RoleGuard] },
  { path: 'usuarios/novo', component: UsuariosCadastroComponent, canActivate: [RoleGuard] },
  { path: 'usuarios/edicao/:matricula', component: UsuariosCadastroComponent, canActivate: [RoleGuard] },
  { path: 'usuario/nova-senha', component: UsuariosNovaSenhaComponent, canActivate: [AuthGuard] },

  { path: 'incendios', component: IncendiosPesquisaComponent },

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
