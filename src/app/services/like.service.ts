import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:3000/api/likes'; // Update to your API URL

  constructor(private http: HttpClient) { }

  getLikesForReview(critic_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/critic/${critic_id}`);
  }

  likeReview(criticId: string, userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { critic_id: criticId, user_id: userId });
  }

  unlikeReview(criticId: string, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${criticId}/${userId}`);
  }
}
