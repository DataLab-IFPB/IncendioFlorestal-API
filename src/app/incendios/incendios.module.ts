import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { IncendiosPesquisaComponent } from './incendios-pesquisa/incendios-pesquisa.component';

@NgModule({
  declarations: [

    IncendiosPesquisaComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RippleModule,
    ProgressSpinnerModule
  ]
})
export class IncendiosModule { }
