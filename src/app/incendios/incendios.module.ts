import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { IncendiosPesquisaComponent } from './incendios-pesquisa/incendios-pesquisa.component';
import { IncendiosCadastroComponent } from './incendios-cadastro/incendios-cadastro.component';

@NgModule({
  declarations: [
    IncendiosPesquisaComponent,
    IncendiosCadastroComponent
  ],
  imports: [
    SharedModule
  ]
})
export class IncendiosModule { }
