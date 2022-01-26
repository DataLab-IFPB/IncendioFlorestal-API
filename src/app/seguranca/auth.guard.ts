import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const user = this.auth.getUsuarioLogado;
    const isAuthenticated = user ? true : false;

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      this.messageService.add({
        severity: 'error',
        summary: 'Para acessar o sistema você deve se autenticar!',
      });
    }

    return isAuthenticated;
  }
}
