import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BookService } from '../services/book.service';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-creating-list',
  templateUrl: './creating-list.component.html',
  styleUrls: ['./creating-list.component.css']
})
export class CreatingListComponent implements OnInit{

  list = {
    title: '',
    description: '',
    books: [] as { book_id: number; title: string; description: string; showDescriptionInput: boolean }[]
  };

  book: any;
  userId: number | null = null;
  query: string = '';
  books: any[] = [];
  dropdownVisible: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  private searchTerms$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthService
  ) {
    this.searchTerms$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((query: string) => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
  }


  performSearch(query: string) {
    this.route.queryParams.subscribe(params => {
      query = params['q'] || query;
      this.searchService.searchBooks(query).subscribe(books => {
        if (books && Array.isArray(books.items)) {
          this.books = books.items;
          this.dropdownVisible = true;
        } else {
          this.dropdownVisible = false;
        }
      }, error => {
        this.dropdownVisible = false;
      });
    });
  }

  onSearch() {
    if (this.query.length > 3) {
      this.searchTerms$.next(this.query);
    } else {
      this.dropdownVisible = false;
    }
  }

  onSelectItem(item: any) {
    this.bookService.addBook(item).subscribe(response => {
      this.bookService.getBookByGoogleId(item.id).subscribe(bookDetail => {
        console.log('Full response:', bookDetail);
        this.book = bookDetail;
        this.addBook(this.book);
      });
    });
    this.dropdownVisible = false;
  }



  addBook(book: any) {
    const bookEntry = {
      book_id: book.book.book_id,
      title: book.book.title,
      description: '',
      showDescriptionInput: false // Add this to manage description input visibility
    };
    console.log('Books in list:', this.list.books);

    this.list.books.push(bookEntry);
  }

  toggleDescriptionInput(index: number) {
    this.list.books[index].showDescriptionInput = !this.list.books[index].showDescriptionInput;
  }

  onSubmit() {
    console.log(this.userId);
    this.http.post('http://localhost:3000/api/lists', {
      title: this.list.title,
      user_id: this.userId,
      description: this.list.description
    }).subscribe((response: any) => {
      const listId = response.list.list_id;
      console.log(listId);
      const bookListEntries = this.list.books.map(book => ({
        list_id: listId,
        book_id: book.book_id,
        description: book.description
      }));

      this.http.post('http://localhost:3000/api/lists_book', bookListEntries).subscribe(() => {
        this.router.navigate(['/profile', this.userId]);

      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

  removeBook(index: number) {
    this.list.books.splice(index, 1);
  }
}
