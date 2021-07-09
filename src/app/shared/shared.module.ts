import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensagemDeErroComponent } from './mensagem-de-erro/mensagem-de-erro.component';



@NgModule({
  declarations: [
    MensagemDeErroComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MensagemDeErroComponent]
})
export class SharedModule { }
