import { Component, OnInit } from '@angular/core';
import { UserBookService } from '../services/user-book.service';
import { AuthService } from '../services/auth.service';
import { CriticService } from '../services/critic.service';
import { Router } from '@angular/router';
import {SearchService} from "../services/search.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  currentStatus: number | null = null;
  books: any[] = [];
  reviews: any[] = [];
  editingReview: any = null;
  bookDetails: any = {}; // To store book details

  constructor(
    private userBookService: UserBookService,
    private authService: AuthService,
    private criticService: CriticService,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.filterBooks(1); // Default to Currently Reading
      this.loadUserReviews(); // Load user reviews
    }
  }

  filterBooks(statusId: number) {
    this.currentStatus = statusId;
    if (this.userId) {
      this.userBookService.getBooksByStatus(this.userId, statusId).subscribe(response => {
        if (response.status === 'OK') {
          this.books = response.books;
        }
      });
    }
  }

  loadUserReviews() {
    if (this.userId) {
      this.criticService.getCriticsByUserId(this.userId).subscribe(response => {
        if (response.status === 'OK') {
          this.reviews = response.reviews;
          this.loadBookDetails();
        }
      });
    }
  }

  loadBookDetails() {
    this.reviews.forEach(review => {
      this.searchService.searchBookById(review.Book.google_books_id).subscribe(book => {
        this.bookDetails[review.Book.google_books_id] = book;
      });
    });
  }

  isActive(statusId: number): boolean {
    return this.currentStatus === statusId;
  }

  onSelectBook(book: any) {
    this.router.navigate(['/book', book.google_books_id]);
  }

  editReview(review: any) {
    this.editingReview = { ...review };
  }

  updateReview() {
    if (this.editingReview) {
      this.criticService.updateCritic(this.editingReview.critic_id, this.editingReview).subscribe(response => {
        if (response.status === 'OK') {
          this.loadUserReviews();
          this.editingReview = null;
        }
      });
    }
  }

  deleteReview(criticId: number) {
    this.criticService.deleteCritic(criticId).subscribe(response => {
      if (response.status === 'OK') {
        this.loadUserReviews();
      }
    });
  }

  cancelEdit() {
    this.editingReview = null;
  }
}
