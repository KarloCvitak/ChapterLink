import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriticService {
  private apiUrl = 'http://localhost:3000/api/reviews'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  // Get all reviews for a book
  getCriticsForBook(bookId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/book/${bookId}`);
  }

  getCriticsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  getCriticsForBookByGoogleID(googleBookId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/googleBooks/${googleBookId}`);
  }

  getCriticById(criticId: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/${criticId}`);
  }

  addCritic(criticData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, criticData);
  }

  updateCritic(criticId: number, criticData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${criticId}`, criticData);
  }

  deleteCritic(criticId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${criticId}`);
  }

}
