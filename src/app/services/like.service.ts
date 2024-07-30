import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:3000/api/likes';

  constructor(private http: HttpClient) { }

  getLikes(criticId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?critic_id=${criticId}&user_id=${userId}`);
  }

  like(criticId: number, userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { critic_id: criticId, user_id: userId });
  }

  unlike(criticId: number, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?critic_id=${criticId}&user_id=${userId}`);
  }
}
