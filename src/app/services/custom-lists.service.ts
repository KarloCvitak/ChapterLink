import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomListsService {

  constructor(private http: HttpClient) { }

  private apiUrl1 = 'http://localhost:3000/api/lists';
  private apiUrl2 = 'http://localhost:3000/api/lists_book';


  getAllListsFromAUser(user_id: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/${user_id}`);
  }

  getAllBooksFromTheList(list_id: number){
    return this.http.get<any>(`${this.apiUrl1}/listBooks/${list_id}`);

  }

  deleteList(list_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl1}/${list_id}`);
  }


}
