import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire'

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SegurancaModule } from './seguranca/seguranca.module';
import { HomeComponent } from './home/home.component';
import { CoreModule } from './core/core.module';


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


    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBCZ9RK2tV3ZTxJlDvkmV-nPJQUwZ3WzcM",
      authDomain: "combate-incendios-dev.firebaseapp.com",
      databaseURL: "https://combate-incendios-dev-default-rtdb.firebaseio.com",
      projectId: "combate-incendios-dev",
      storageBucket: "combate-incendios-dev.appspot.com",
      messagingSenderId: "883770424001",
      appId: "1:883770424001:web:72bf5cfadf0b7708c63240"
    })


  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
