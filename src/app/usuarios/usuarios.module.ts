import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosNovaSenhaComponent } from './usuarios-nova-senha/usuarios-nova-senha.component';

@NgModule({
  declarations: [
    UsuariosPesquisaComponent,
    UsuariosCadastroComponent,
    PerfilComponent,
    UsuariosNovaSenhaComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UsuariosModule { }
