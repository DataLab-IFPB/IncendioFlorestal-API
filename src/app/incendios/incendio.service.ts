import { Incendio } from './../core/model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs-compat/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class IncendioService {

  private dbPath = '/dados-firms';


  incendios: AngularFireList<Incendio[]> = null;

  constructor(
    private db: AngularFireDatabase
  ) { }




  getFire(numberItems, startKey?): AngularFireList<Incendio[]> {
    console.log("get fire")
    // startKey == undefined ? startKey = "" : console.log('key usada: ', startKey)

    if (startKey == undefined) {
      startKey = ""
      console.log('key vazia')
    } else {
      console.log('key usada: ', startKey)
    }

    return this.db.list(this.dbPath, ref => {
      return ref.orderByKey().startAt(startKey).limitToFirst(numberItems + 1);
    });
  }


  // getCustomers(numberItems, startKey?): AngularFireList<Incendio[]> {
  // this.incendios = this.db.list(this.dbPath, {
  // query: {
  //   orderByKey: true,
  //   startAt: startKey,
  //   limitToFirst: numberItems + 1
  // }
  // });




  // return this.incendios;
  // }


  listar() {
    return this.db.list(this.dbPath)
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
          ({
            key: c.payload.key, ...c.payload.exportVal()
          })
          )
        )
      )
  }



  excluir(key: string) {

    console.log('remover ', key)

    const incendio = {
      isDeleted: true,
      deletedAt: new Date()
    }

    return this.db.list(this.dbPath).update(key, incendio);
  }

}
