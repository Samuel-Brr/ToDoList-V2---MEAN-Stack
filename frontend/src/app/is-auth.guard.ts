import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root'
})
export class IsAuthGuard implements CanActivate {

  constructor(private auth: AuthStore,
    private router: Router){}

  canActivate(route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot):boolean |  Observable<boolean | UrlTree> {

        // return this.checkIfAuthenticated()
        return true
  }

  private checkIfAuthenticated() {
    return this.auth.isLoggedIn$
                .pipe(
                  map(loggedIn =>
                      loggedIn? true: this.router.parseUrl('/login'))
                )
  }

}
