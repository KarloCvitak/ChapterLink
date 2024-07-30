// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/login`, credentials);
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/register`, user);
  }

  checkUsernameEmail(username: string, email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/check-username-email`, { username, email });
  }

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

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
