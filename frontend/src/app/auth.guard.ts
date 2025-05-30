import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {
        return this.auth.isLogged()
            ? true
            : this.router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url },
            });
    }
}
