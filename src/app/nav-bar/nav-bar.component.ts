import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  userId: number | null = null;

  constructor(private authService: AuthService, private router: Router) {

  }
  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    console.log("NAV-BAR COMPONENT INIT" + this.userId)
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
