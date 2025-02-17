// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {AUTH_ENDPOINTS} from "../../url_constants/urlConstants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_ENDPOINTS.LOGIN, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_ENDPOINTS.REGISTER, user);
  }
}
