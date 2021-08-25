import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';

import { LoginComponent } from './login/login.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,

    SharedModule,

    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DialogModule,

  ]
})
export class SegurancaModule { }
