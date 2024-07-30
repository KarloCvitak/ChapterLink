import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  followUser(followerId: number | null, followedId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/followings`, { follower_id: followerId, followed_id: followedId });
  }

  unfollowUser(followerId: number | null, followedId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/followings`, { body: { follower_id: followerId, followed_id: followedId } });
  }

  checkIfFollowing(followerId: number | null, followedId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/followings/check/${followerId}/${followedId}`);
  }
}
