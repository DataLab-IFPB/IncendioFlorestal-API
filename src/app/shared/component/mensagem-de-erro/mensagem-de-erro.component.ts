import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mensagem-de-erro',
  templateUrl: './mensagem-de-erro.component.html',
  styleUrls: ['./mensagem-de-erro.component.css'],
})
export class MensagemDeErroComponent {
  @Input() erro: string;
  @Input() controle: FormControl;
  @Input() mensagem: string;

  temErro(): boolean {
    return this.controle.hasError(this.erro) && this.controle.dirty;
  }
}
