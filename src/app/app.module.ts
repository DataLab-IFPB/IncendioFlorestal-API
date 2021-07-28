import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire'
import {AngularFireDatabaseModule} from '@angular/fire/database'

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


  // AngularFireModule.initializeApp(environment.firebaseConfig)


// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// adminConfig.credential = admin.credential.cert(serviceAccount);
// admin.initializeApp(adminConfig);

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://combate-incendios-dev-default-rtdb.firebaseio.com'
// });



// const serviceAccount = process.env.MY_CREDENTIALS;

// admin.initializeApp({
// credential: admin.credential.cert(serviceAccount)
// });



// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: "combate-incendios-dev",
//     clientEmail: "firebase-adminsdk-hjigm@combate-incendios-dev.iam.gserviceaccount.com",
//     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOQAeP+2vQc2WK\n06vHn1CgQPpvncf0UdtZxsoNnHxZxa85oKE9H2ZX3vB7EqvabRv+yx1IE4D2bRBf\nrUnX57pQvJeG0r3AhcgYZgrU2zAuiSIC0VTriFDa68OAubgV5rcwrBkSaigv4P8e\nFhcNM9nzb1kWTzGe+4f6cjZ1w9lmpiakPGKZ+UzF+4wMc5rFrxE9tSQS5qshBz+T\nqR+sRbIQd0j+jqYOkbXYly54pMHk29ifoXHiTpkzEr0pozSs60qsPag6dhJ5uHzW\nYpUcQTYXKWEegUhxICv/SolNk0at+EFjdv/z03qSheDOUBFu3b3JfcbLkg1y39rh\n6q/LKdoRAgMBAAECggEAMhKH83v77xHQ/W0Jt49VVO6pjkcNSCLGYOua2saaxvWw\nJoq5knwIzfz9P7fm+oLCSO+5Zmn7xXfxgXTx6EWlLVw34l7P/AlOrKO7bfVf43Be\nDjaRihQgYyHZZytPhpuqblndxWN56bPTZBPDWWx09b2a8Ihd+OXCm7o2QA2B/oIY\n6lflQ3EVx9r41OAEL1eLq3uyvvbnghwh/htuaANKu5p6kC3PAa1DjeSbqlAtvu81\nPbpjyrieD2hzoxP30Lq2S+RbdeyZd+K3ri+MyNLzcIdSbDAYDTj5FKyam1qXS8wX\n0MqOM0lWwaMhP7wy6IdZTp5wcBNJWgvgiYtUl0MQdQKBgQDpLu3eKrI2S1fSceGZ\nGJ0T/QHfQkyF6V3fT6oZan4rVvRR1LBVgIy6W2Mv82K0iNGnaCOrabbs+rwK8obl\nTNUFDm33QIc3gPr7EfY/JzKIufawhqBrJlho3MOpUF3TjKNWN90fvON4dC71nCBH\nFL3E01XfVCtfw32PIvV8gr6ehQKBgQDibnGF23KPCVfxfGeNgqVb77oI7iHoOJB8\n0Sks46vZEtzT/SMPJWlf6zTD/cbbJUdydzuW+vorbus+eim15FxDDncZeH55ZUVL\nmDqecZBnlUhdDh0XsVwxgAmaitoKm+SlhQetLCL7411HsK1WIdKdmbZXf8Wueu6F\nTutBMvPhHQKBgD3qwiqt96hHFUjCCH9Yc80s72RS/HLKZqy3QJmDF4F2k2VvLmtl\nuPh677l5zQnXEqR7GI2ZgoMmiOv3Pi6A2kd/b1+p+L2aOAqW2GYoiFiZ2JFDDjGl\nevBNPn8k4eUcgPqR1ttokpYXc6iwDjoRndo3q6Oje+jvxdVOGRU4uljpAoGBAKXA\nPy3DdFqsdkn5zTvTlQR1ufLrjrqVHX+hBMktaBChNDGiLdXahwaGALwvuy+UXHa4\nPVDKK/M7YMz9VCcoITmdDyYABGUM8urhZpexfgm1R6GGwVkkpd4+YclVN0No1rkr\nZnEny/wjdZcTB+/zFl/zs3zdtXGB37SKDsBNciUpAoGACs9dE+PxBV4rcqRaNQBX\n2U7ZjjtwpyLQKpN6GZ2Y7PWvJv5n7MCHvgJy0Jko4zSDa4rgoUZmttKO3+IU2XJi\n5snQffbwCdIjAoFf0pGx1P9WFPY2NmyryLP4z0Y4ijC5DVq2AUfjEqqRRsmLz+3T\nfWNvyJHM9zVKPhBCWIUZrJw=\n-----END PRIVATE KEY-----\n"
//   }),
//   databaseURL: "https://combate-incendios-dev-default-rtdb.firebaseio.com"
// });


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

    AngularFireModule.initializeApp(environment.firebaseConfig)





  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
