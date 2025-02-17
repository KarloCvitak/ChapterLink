// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {COMMENTS_ENDPOINTS} from "../../url_constants/urlConstants";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(commentData: any): Observable<any> {
    return this.http.post(COMMENTS_ENDPOINTS.COMMENT, commentData);
  }
  getCommentsForReview(critic_id: number): Observable<any> {
    return this.http.get(COMMENTS_ENDPOINTS.COMMENT_REVIEW + critic_id);
  }
  updateComment(commentId: number, commentData: any): Observable<any> {
    return this.http.put(COMMENTS_ENDPOINTS.COMMENT + commentId, commentData);
  }
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(COMMENTS_ENDPOINTS.COMMENT + commentId);
  }
}


