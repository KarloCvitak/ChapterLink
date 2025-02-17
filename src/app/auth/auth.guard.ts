import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import {TokenService} from "../services/auth-services/token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router) {}

  canActivate(): boolean {
    if (this.tokenService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
