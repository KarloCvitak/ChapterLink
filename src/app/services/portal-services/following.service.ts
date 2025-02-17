import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  constructor(private http: HttpClient) { }

  private apiUrl1 = 'http://localhost:3000/api/followings';

  getReviewsFromFollowedUsers(user_id: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl1}/${user_id}`);
  }


}
