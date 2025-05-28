import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        return this.auth.isAdmin()
            ? true
            : this.router.createUrlTree(['/landing']);   
    }
    canEnter(): boolean | UrlTree {
        return this.auth.isLogged()
        ? true
        : this.router.createUrlTree(['/login']);
    }
}
