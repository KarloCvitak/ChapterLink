import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/portal-services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnDestroy {
  query: string = '';
  books: any[] = [];
  users: any[] = [];
  lists: any[] = [];
  dropdownVisible: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();
  private searchTerms$: Subject<string> = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router, private route: ActivatedRoute) {
    // Subscribe to search terms subject with debounce
    this.searchTerms$.pipe(
      debounceTime(300), // debounce for 300ms
      takeUntil(this.destroy$) // unsubscribe when component is destroyed
    ).subscribe((query: string) => {
      this.performSearch(query);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    if (this.query.length > 3) {
      // Emit search term to searchTerms$ subject
      this.searchTerms$.next(this.query);
    } else {
      this.dropdownVisible = false;
    }
  }

  performSearch(query: string) {
    this.route.queryParams.subscribe(params => {
      query = params['q'] || query; // Use query from params or current input

      // If the query contains an underscore, skip the book search
      if (!query.includes('_')) {
        this.searchService.searchBooks(query).subscribe(books => {
          console.log('Books response:', books); // Log the entire response
          if (books && Array.isArray(books.items)) {
            this.books = books.items;
          } else {
            console.error('Error: books.items is not an array:', books);
          }
        }, error => {
          console.error('Error fetching books:', error);
        });
      }

      // Always search for users
      this.searchService.searchUsers(query).subscribe(response => {
        console.log('Users response:', response); // Log the entire response
        if (response && Array.isArray(response.data)) {
          this.users = response.data;
        } else {
          console.error('Error: response.data is not an array:', response);
        }
      }, error => {
        console.error('Error fetching users:', error);
      });

      // Always search for lists
      this.searchService.searchLists(query).subscribe(response => {
        console.log('Lists response:', response); // Log the entire response
        if (response && Array.isArray(response.data)) {
          this.lists = response.data;
        } else {
          console.error('Error: response.data is not an array:', response);
        }
      }, error => {
        console.error('Error fetching lists:', error);
      });

      this.dropdownVisible = true; // Show the dropdown
    });
  }
  onEnter() {
    if (this.query.length > 2) {
      this.router.navigate(['/search'], { queryParams: { q: this.query } });
    }
  }

  onSelectItem(item: any) {
    if (item.username) {
      this.router.navigate(['/profile', item.user_id]);
    } else if (item.id) {
      this.router.navigate(['/book', item.id]);
    }
    this.dropdownVisible = false;
  }
}
