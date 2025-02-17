import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TokenService} from "../auth-services/token.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getUserById(userId: number | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  updateUsername(currentUserId: number | null, username: string): Observable<any> {
    console.log("username  " + username);
    // Send username as an object
    return this.http.put(`${this.baseUrl}/users/${currentUserId}`, { username });
  }

  getCurrentUserId(): number | null {
    const token = this.tokenService.getToken();

    if (!token) return null;

    const payload = this.tokenService.parseToken(token);
    return payload?.id || null;
  }

  //TODO on backend move this to users
  checkUsernameEmail(username: string, email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/check-username-email`, { username, email });
  }
}
