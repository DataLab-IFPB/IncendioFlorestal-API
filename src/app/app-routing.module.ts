import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './seguranca/auth.guard';
import { LoginComponent } from './seguranca/login/login.component';
import { HomeComponent } from './home/home.component';
 import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   component: LoginComponent },

  { path: 'home',   component: HomeComponent, canActivate: [AuthGuard]  },


  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent},
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
