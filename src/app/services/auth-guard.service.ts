import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  //if there's not user stored in local storage then user need to sign up 
  //and shouldn't be able to access the welcome page
  canActivate(): boolean {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['signup']);
      return false;
    }
    return true;
  }
  constructor(public router: Router) { }

}
