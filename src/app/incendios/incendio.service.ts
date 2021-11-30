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

  constructor(
    private db: AngularFireDatabase
  ) { }


  listar(numberItems, startKey?): AngularFireList<Incendio[]> {
    return this.db.list(this.dbPath, ref => {

      var query = ref.orderByKey().limitToFirst(numberItems + 1); // limitToFirst começa a partir do topo da coleção

      if (startKey) { // Se não houver cursor, começa no início da coleção ... caso contrário, começa no cursor
        query = query.startAt(startKey);
      }

      return query;
    });
  }


  getIncendios() {
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

  // exportVal(incendios: AngularFireList<Incendio[]>) {
  //   return incendios.snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c =>
  //       ({
  //         key: c.payload.key, ...c.payload.exportVal()
  //       })
  //       )
  //     )
  //   )
  // }


  excluir(key: string) {

    const incendio = {
      isDeleted: true,
      deletedAt: new Date()
    }

    return this.db.list(this.dbPath).update(key, incendio);
  }

}
