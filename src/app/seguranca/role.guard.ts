import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { UsuarioService } from './../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private location: Location
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.auth.getUsuarioLogado;

    return this.usuarioService.buscarUsuarioPorEmail(user.email)
      .then(user => {
        if (user.isAdmin) {
          return true;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Apenas admins têm acesso!' });
          this.location.back();
          return false;
        }
      })
  }

}
