import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { IncendioService } from '../incendio.service';
import { Incendio, Clima } from '../incendio';

@Component({
  selector: 'app-incendios-cadastro',
  templateUrl: './incendios-cadastro.component.html',
  styleUrls: ['./incendios-cadastro.component.css'],
})
export class IncendiosCadastroComponent implements OnInit {
  incendio = new Incendio();

  key = this.route.snapshot.params['key'];

  periodos = [
    { label: 'Dia', value: 'D' },
    { label: 'Noite', value: 'N' },
  ];

  status = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];

  constructor(
    private incendioService: IncendioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.incendio.clima = new Clima();

    if (this.key) this.buscarIncendio(this.key);
  }

  get editando() {
    return this.key ? true : false;
  }

  buscarIncendio(key: string) {
    this.incendioService
      .buscarIncendioPorKey(key)
      .snapshotChanges()
      .subscribe((incendio) => {
        this.incendio = {
          key: incendio[0].payload.key,
          ...incendio[0].payload.exportVal(),
        };
      });
  }

  salvar() {
    this.editando ? this.atualizar() : this.cadastrar();
  }

  cadastrar() {
    this.incendioService
      .cadastrar(this.incendio)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Incêndio cadastrado!',
        });
        this.router.navigate(['/incendios']);
      })
      .catch((erro) => {
        this.messageService.add({ severity: 'error', summary: erro });
      });
  }

  atualizar() {
    this.incendioService
      .atualizar(this.incendio)
      .then(() => {
        this.router.navigate(['/incendios']);
        this.messageService.add({
          severity: 'success',
          summary: 'Incêndio atualizado!',
        });
      })
      .catch((erro) => {
        this.messageService.add({ severity: 'error', summary: erro });
      });
  }

  goBack() {
    this.location.back();
  }
}
