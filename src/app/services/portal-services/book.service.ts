import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BOOK_ENDPOINTS} from "../../url_constants/urlConstants";
import {UserBook} from "../../models/UserBook";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) {}


  getBookByGoogleId(google_books_id: any){
    return this.http.get(BOOK_ENDPOINTS.GOOGLE + google_books_id);
  }

  addBook(bookData: any): Observable<any> {

    const userBookData: UserBook = {
      google_books_id: bookData.id,
      title: bookData.volumeInfo.title,
      authors: bookData.volumeInfo.authors ? bookData.volumeInfo.authors.join(', ') : '',
      cover_image: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : '',
      published_date: bookData.volumeInfo.publishedDate,
    };
    return this.http.post(BOOK_ENDPOINTS.BOOK, userBookData);
  }


}
