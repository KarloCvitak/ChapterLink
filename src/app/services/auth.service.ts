// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {ENDPOINT} from "../url_constants/urlConstants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(ENDPOINT.LOGIN, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(ENDPOINT.REGISTER, user);
  }


  // why is this in auth service?
  // TODO Move to user.service
  checkUsernameEmail(username: string, email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/check-username-email`, { username, email });
  }

  //why is this in auth service?
  //use uses token stuff it can stay in auth
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    console.log("getCurrentUserId() token:", token);

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const tokenPayload = JSON.parse(jsonPayload);
        console.log("Token Payload:", tokenPayload);

        return tokenPayload.id || null; // Ensure 'id' exists
      } catch (e) {
        console.error('Error parsing token payload:', e);
        return null;
      }
    } else {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log("setToken:" + token);
    this.authState.next(true);
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  // TODO move to token-service
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  //not used, what is its purpose?
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
