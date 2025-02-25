import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/portal-services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  books: any[] = [];
  users: any[] = [];
  lists: any[] = [];
  currentFilter: string = 'all'; // Default to show all results initially

  filteredBooks: any[] = [];
  genres: string[] = [];
  selectedGenre: string = '';

  constructor(private route: ActivatedRoute, private searchService: SearchService, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.searchService.searchBooks(this.query).subscribe(books => {
        if (books && Array.isArray(books.items)) {
          this.books = books.items;
          this.filteredBooks = this.books;
          this.prepareGenres();
        } else {
          console.error('Error: books.items is not an array:', books);
        }
      }, error => {
        console.error('Error fetching books:', error);
      });

      this.searchService.searchUsers(this.query).subscribe(response => {
        if (response && Array.isArray(response.data)) {
          this.users = response.data;
        } else {
          console.error('Error: response.data is not an array:', response);
        }
      }, error => {
        console.error('Error fetching users:', error);
      });

      this.searchService.searchLists(this.query).subscribe(response => {
        if (response && Array.isArray(response.data)) {
          this.lists = response.data;
        } else {
          console.error('Error: response.data is not an array:', response);
        }
      }, error => {
        console.error('Error fetching lists:', error);
      });
    });
  }

  filterResults(filter: string) {
    this.currentFilter = filter;
  }

  showAllResults() {
    this.currentFilter = 'all';
  }

  onSelectItem(item: any) {
    if (item.username) {
      this.router.navigate(['/profile', item.user_id]);
    } else if (item.id) {
      this.router.navigate(['/book', item.id]);
    }
  }


  prepareGenres() {
    const genreSet = new Set<string>();
    this.books.forEach(book => {
      if (book.volumeInfo.categories) {
        book.volumeInfo.categories.forEach((category: string) => genreSet.add(category));
      }
    });
    this.genres = Array.from(genreSet);
  }

  filterBooksByGenre() {
    if (this.selectedGenre) {
      this.filteredBooks = this.books.filter(book =>
        book.volumeInfo.categories && book.volumeInfo.categories.includes(this.selectedGenre)
      );
    } else {
      this.filteredBooks = this.books;
    }
  }

}
