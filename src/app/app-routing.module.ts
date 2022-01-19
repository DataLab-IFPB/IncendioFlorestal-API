import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './shared/component/pagina-nao-encontrada/pagina-nao-encontrada.component';


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
