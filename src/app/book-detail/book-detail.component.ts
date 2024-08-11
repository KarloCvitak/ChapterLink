
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { UserBookService } from '../services/user-book.service';
import { AuthService } from '../services/auth.service';
import {LikeService} from "../services/like.service";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  bookId: string = '';
  book: any;
  userId: number | null = null;
  currentStatus: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private userBookService: UserBookService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
      this.searchService.searchBookById(this.bookId).subscribe(book => {
        this.book = book;
        if (this.userId) {
          this.getCurrentStatus();
        }
      });
    });
  }

  getCurrentStatus() {
    if (this.userId && this.book) {
      this.userBookService.getBookStatus(this.userId, this.book.id).subscribe(response => {
        if (response.status === 'OK') {
          this.currentStatus = response.status_id;
        }
      });
    }
  }

  addToStatus(statusId: number) {
    if (this.userId && this.book) {
      if (this.currentStatus === statusId) {
        // If the current status is the same as the clicked status, deselect it
        this.userBookService.removeBookStatus(this.userId, this.book.id).subscribe(response => {
          console.log('Book status removed', response);
          this.currentStatus = null;
        });
      } else {
        // Otherwise, update the status
        this.userBookService.addBookToUserStatus(this.userId, this.book, statusId).subscribe(response => {
          console.log('Book status updated', response);
          this.currentStatus = statusId;
        });
      }
    }
  }


  isActive(statusId: number): boolean {
    return this.currentStatus === statusId;
  }



}
