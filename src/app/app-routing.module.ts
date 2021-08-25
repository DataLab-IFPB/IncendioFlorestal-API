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

  // TODO: add guard

  { path: 'home', component: HomeComponent },

  { path: 'perfil', component: PerfilComponent },

  // TODO: Criar guarda para validar se o usuário logado é admin
  { path: 'usuarios', component: UsuariosPesquisaComponent },
  { path: 'usuarios/novo', component: UsuariosCadastroComponent },
  { path: 'usuarios/edicao/:keyUsuario', component: UsuariosCadastroComponent },


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
