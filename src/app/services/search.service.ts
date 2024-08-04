import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private googleBooksUrl = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyC2hbiOgavgsJUKOhptRsfbHQCMDV1Ix7w';
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  searchUsers(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/users?q=${query}`);
  }
  searchBooks(query: string): Observable<any> {
    const url = `${this.googleBooksUrl}?q=${query}&key=${this.apiKey}&maxResults=25`;
    return this.http.get(url);
  }

  searchBookById(bookId: string): Observable<any> {
    const url = `${this.googleBooksUrl}/${bookId}?key=${this.apiKey}`;
    return this.http.get(url);
  }

  searchLists(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/lists?q=${query}`);
  }
}
