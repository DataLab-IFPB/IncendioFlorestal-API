import { Incendio } from './../core/model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import 'rxjs-compat/add/operator/first';
import 'rxjs/add/operator/map';

import * as moment from 'moment';

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

      let query = ref.orderByKey().limitToFirst(numberItems + 1); // limitToFirst começa a partir do topo da coleção

      if (startKey) { // Se não houver cursor, começa no início da coleção ... caso contrário, começa no cursor
        query = query.startAt(startKey);
      }

      return query;
    });
  }

  // get all
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

  cadastrar(incendio: Incendio) {
    const fire = {
      daynight: incendio.daynight,
      brightness: incendio.brightness,
      ativo: incendio.ativo,
      latitude: incendio.latitude,
      longitude: incendio.longitude,
      clima: incendio.clima,
      acq_datetime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
    }

    return this.db.list(this.dbPath).push(fire);
  }

  atualizar(incendio: Incendio) {
    const fire = {
      daynight: incendio.daynight,
      brightness: incendio.brightness,
      ativo: incendio.ativo,
      latitude: incendio.latitude,
      longitude: incendio.longitude,
      clima: incendio.clima,
      updatedAt: new Date()
    }

    return this.db.list(this.dbPath).update(incendio.key, fire)
  }

  excluir(key: string) {
    const fire = {
      isDeleted: true,
      deletedAt: new Date()
    }

    return this.db.list(this.dbPath).update(key, fire);
  }


  buscarIncendioPorKey(key: string): AngularFireList<Incendio[]> {
    return this.db.list(this.dbPath, ref => {
      return ref.orderByKey().equalTo(key)
    });
  }

  buscarIncendioPorLatitude(latitude: string): AngularFireList<Incendio[]> {
    return this.db.list(this.dbPath, ref => {
      return ref.orderByChild("latitude").equalTo(latitude)
    });
  }


}
