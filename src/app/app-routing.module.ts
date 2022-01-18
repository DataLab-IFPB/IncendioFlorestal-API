import { HomeModule } from './home/home.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { IncendiosModule } from './incendios/incendios.module';
import { SegurancaModule } from './seguranca/seguranca.module';
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
  // Rota vazia, redireciona para '/login'
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login',
    loadChildren: () => import('./seguranca/seguranca.module').then(m => m.SegurancaModule)
  },

  { path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
  },

  { path: 'incendios',
    loadChildren: () => import('./incendios/incendios.module').then(m => m.IncendiosModule)
  },

  { path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },

  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },

  // Rota inválida, redireciona para '/pagina-nao-encontrada'
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
