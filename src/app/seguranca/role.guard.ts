import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { ToastService } from 'src/app/shared/service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private location: Location,
    private toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.auth.getUsuarioLogado;

    if (user.isAdmin) {
      return true;
    } else {
      this.toastService.showMessage('error', 'Apenas admins têm acesso!');
      this.location.back();
      return false;
    }
  }
}
