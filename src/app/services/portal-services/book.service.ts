import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) {}


  getBookByGoogleId(google_books_id: any){
    return this.http.get(`${this.apiUrl}/google/${google_books_id}`);
  }

  addBook(bookData: any): Observable<any> {

    const userBookData = {
      google_books_id: bookData.id,
      title: bookData.volumeInfo.title,
      authors: bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(', ') : '',
      cover_image: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : '',
      published_date: bookData.volumeInfo.publishedDate,
    };
    return this.http.post(`${this.apiUrl}`, userBookData);
  }


}
