import { Incendio } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { IncendioService } from '../incendio.service';
@Component({
  selector: 'app-incendios-cadastro',
  templateUrl: './incendios-cadastro.component.html',
  styleUrls: ['./incendios-cadastro.component.css']
})
export class IncendiosCadastroComponent implements OnInit {

  incendio = new Incendio();

  key = this.route.snapshot.params['key'];

  constructor(
    private incendioService: IncendioService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit(): void {
    console.log('key ', this.key)
  }


  get editando() {
    return this.key ? true : false;
  }

  buscarIncendio(key: string) {

  }

  salvar() {

  }

  cadastrar() {

  }

  atualizar() {

  }

  goBack() {
    this.location.back();
  }


}
