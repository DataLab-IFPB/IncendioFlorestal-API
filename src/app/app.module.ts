import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire'
import {AngularFireDatabaseModule} from '@angular/fire/database'
import { AngularFireAuthModule } from "@angular/fire/auth";

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SegurancaModule } from './seguranca/seguranca.module';
import { HomeComponent } from './home/home.component';
import { CoreModule } from './core/core.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { environment } from '../environments/environment';

import * as admin from 'firebase-admin'




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    CoreModule,
    ToastModule,

    AppRoutingModule,

    SegurancaModule,
    UsuariosModule,

    AngularFireDatabaseModule,
    AngularFireAuthModule,

    AngularFireModule.initializeApp(environment.firebaseConfig)





  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
