import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SharedModule } from './../shared/shared.module';
import { SegurancaRoutingModule } from './seguranca-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, SegurancaRoutingModule],
})
export class SegurancaModule {}
