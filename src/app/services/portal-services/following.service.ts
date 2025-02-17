import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FOLLOWING_ENDPOINTS} from "../../url_constants/urlConstants";

@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  constructor(private http: HttpClient) { }

  getReviewsFromFollowedUsers(user_id: number | null): Observable<any> {
    return this.http.get(FOLLOWING_ENDPOINTS.FOLLOWINGS + user_id);
  }

  followUser(followerId: number | null, followedId: number): Observable<any> {
    return this.http.post(FOLLOWING_ENDPOINTS.FOLLOWINGS, { follower_id: followerId, followed_id: followedId });
  }

  unfollowUser(followerId: number | null, followedId: number): Observable<any> {
    return this.http.delete(FOLLOWING_ENDPOINTS.FOLLOWINGS, { body: { follower_id: followerId, followed_id: followedId } });
  }

  checkIfFollowing(followerId: number | null, followedId: number): Observable<any> {
    return this.http.get(`${FOLLOWING_ENDPOINTS.CHECK}${followerId}/${followedId}`);
  }
}
