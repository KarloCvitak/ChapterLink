// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) { }

  addComment(commentData: any): Observable<any> {
    return this.http.post(this.baseUrl, commentData);
  }
  getCommentsForReview(critic_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/critics/${critic_id}`);
  }
  updateComment(commentId: number, commentData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${commentId}`, commentData);
  }
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${commentId}`);
  }
}


