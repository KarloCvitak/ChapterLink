import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBookService {
  private apiUrl = 'http://localhost:3000/api/user_book';

  constructor(private http: HttpClient) {}

  updateBookStatus(bookId: number, statusId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${bookId}`, { status_id: statusId });
  }

  addBookToUserStatus(userId: number | null, bookData: any, statusId: number): Observable<any> {
    console.log(
      "addBookToUserStatus userId:" +
      userId +
      " bookData " + JSON.stringify(bookData) +
      " statusId "
    );

    const userBookData = {
      user_id: userId,
      google_books_id: bookData.id,
      title: bookData.volumeInfo.title,
      authors: bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(', ') : '',
      cover_image: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : '',
      published_date: bookData.volumeInfo.publishedDate,
      status_id: statusId
    };
    return this.http.post(`${this.apiUrl}`, userBookData);
  }
  getBookStatus(userId: number, googleBooksId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`, { params: { user_id: userId, google_books_id: googleBooksId } });
  }
  getBooksByStatus(userId: number | null, statusId: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/status/${statusId}`);
  }

  removeBookStatus(userId: number, bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${bookId}/status`);
  }

}
