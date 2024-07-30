import { Component, Input, OnInit } from '@angular/core';
import { CriticService } from '../services/critic.service';
import { AuthService } from '../services/auth.service';
import { UserBookService } from '../services/user-book.service';
import { SearchService } from "../services/search.service"; // Ensure you have this service

@Component({
  selector: 'app-critic',
  templateUrl: './critic.component.html',
  styleUrls: ['./critic.component.css']
})
export class CriticComponent implements OnInit {
  @Input() bookId!: string;
  userId: number | null = null;
  critics: any[] = [];
  newCritic = { rating: 0, review_text: '' };
  book: any;
  currentStatus: number | null = null;

  constructor(
    private criticService: CriticService,
    private authService: AuthService,
    private searchService: SearchService,
    private bookService: UserBookService // Inject BookService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();

    console.log("Google book id: at critic comoponet:" + this.bookId);

    this.searchService.searchBookById(this.bookId).subscribe(book => {
      this.book = book;
      this.loadCritics();

      console.log("NEZNAM TEST1 " + this.book.id);
      if (this.userId) {
        this.getCurrentStatus();
      }
    });
  }

  loadCritics() {
    this.criticService.getCriticsForBookByGoogleID(this.book.id).subscribe(response => {
      if (response.status === 'OK') {
        this.critics = response.reviews.map((critic: any) => ({
          ...critic,
          editMode: false,
          editCriticData: { ...critic }
        }));
      }
    });
  }

  addCritic() {
    if (this.userId && this.bookId) {
      this.bookService.addBookToUserStatus(this.userId, this.book, 1).subscribe(() => { // Assuming 1 is 'Read' status ID
        const criticData = {
          user_id: this.userId,
          google_books_id: this.bookId, // Ensure this matches with backend if needed
          rating: this.newCritic.rating,
          review_text: this.newCritic.review_text
        };

        this.criticService.addCritic(criticData).subscribe(response => {
          if (response.status === 'OK') {
            this.loadCritics();
            this.newCritic = { rating: 0, review_text: '' };
          }
        });
      });
    }
  }

  getCurrentStatus() {
    if (this.userId && this.book) {
      this.bookService.getBookStatus(this.userId, this.book.id).subscribe(response => {
        if (response.status === 'OK') {
          this.currentStatus = response.status_id;
          console.log("TEST1  " + this.userId + " " + this.book.id + " " + response.status_id);
        }
      });
    }
  }

  deleteCritic(criticId: number) {
    this.criticService.deleteCritic(criticId).subscribe(response => {
      if (response.status === 'OK') {
        this.loadCritics();
      }
    });
  }

  editCritic(critic: any) {
    critic.editMode = true;
  }

  cancelEdit(critic: any) {
    critic.editMode = false;
    critic.editCriticData = { ...critic };
  }

  updateCritic(critic: any) {
    this.criticService.updateCritic(critic.editCriticData.critic_id, critic.editCriticData).subscribe(response => {
      if (response.status === 'OK') {
        this.loadCritics();
      }
    });
  }
}
