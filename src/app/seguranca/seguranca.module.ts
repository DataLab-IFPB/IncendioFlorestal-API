import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import {CardModule} from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';

import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,

    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,

  ]
})
export class SegurancaModule { }
