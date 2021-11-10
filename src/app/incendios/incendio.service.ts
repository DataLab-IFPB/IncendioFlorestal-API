import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs-compat/add/operator/first';

@Injectable({
  providedIn: 'root'
})
export class IncendioService {

  private dbPath = '/dados-firms';

  constructor(
    private db: AngularFireDatabase
  ) { }


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





}
