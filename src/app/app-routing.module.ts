import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './shared/component/pagina-nao-encontrada/pagina-nao-encontrada.component';
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

  { path: 'home', component: HomeComponent },

  { path: 'perfil', component: PerfilComponent },

  { path: 'usuarios', component: UsuariosPesquisaComponent },
  { path: 'usuarios/novo', component: UsuariosCadastroComponent},
  { path: 'usuarios/edicao/:matricula', component: UsuariosCadastroComponent },
  { path: 'usuario/nova-senha', component: UsuariosNovaSenhaComponent},

  { path: 'incendios', component: IncendiosPesquisaComponent },
  { path: 'incendios/novo', component: IncendiosCadastroComponent},
  { path: 'incendios/edicao/:key', component: IncendiosCadastroComponent },

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
