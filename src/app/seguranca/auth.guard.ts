import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { ToastService } from 'src/app/shared/service/toast.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const user = this.auth.getUsuarioLogado;
    const isAuthenticated = user ? true : false;

    if (!isAuthenticated) {
      this.toastService.showMessage(
        'error',
        'Para acessar o sistema você deve se autenticar!'
      );
      this.router.navigate(['/login']);
    }

    return isAuthenticated;
  }
}
