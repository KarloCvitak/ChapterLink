import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-services/auth.service';
import { SearchService } from '../../../services/portal-services/search.service';
import {TokenService} from "../../../services/auth-services/token.service";
import {UserService} from "../../../services/user-services/user.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  userId: number | null = null;

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router) {

  }
  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserId();
    console.log("NAV-BAR COMPONENT INIT" + this.userId)
  }

  logout() {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }
}
