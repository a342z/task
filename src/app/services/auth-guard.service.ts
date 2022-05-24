import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  canActivate(): boolean {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['signup']);
      return false;
    }
    return true;
  }
  constructor(public router: Router) {}

}
