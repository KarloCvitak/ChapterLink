import { Component, OnInit } from '@angular/core';
import { UserBookService } from '../services/user-book.service';
import { AuthService } from '../services/auth.service';
import { CriticService } from '../services/critic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { LikeService } from '../services/like.service';
import { CustomListsService } from '../services/custom-lists.service';
import {UserService} from "../services/user.service";
import {RoleService} from "../services/role.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  currentUserId: number | null = null;
  currentStatus: number | null = null;
  books: any[] = [];
  lists: any[] = [];
  reviews: any[] = [];
  editingReview: any = null;
  bookDetails: any = {}; // To store book details

  likesCountMap: { [criticId: number]: number } = {};
  userLikesMap: { [criticId: number]: boolean } = {};
  likesUserMap: { [criticId: number]: any[] } = {}; // Map to store users who liked

  // Manage hover state
  hoverState: { [criticId: number]: boolean } = {}; // Toggle hover state

  currentUser: any;
  isAdmin: boolean = false;

  constructor(
    private userBookService: UserBookService,
    private authService: AuthService,
    private criticService: CriticService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private likesService: LikeService,
    private customListsService: CustomListsService,
    private userService: UserService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Retrieve user ID from route parameters

      this.reloadLists();




      if (this.userId) {
        this.filterBooks(1); // Default to Currently Reading
        this.loadUserReviews(); // Load user reviews
        this.checkIfAdmin(this.currentUserId);
      }
    });
  }



  reloadLists(){
    this.customListsService.getAllListsFromAUser(this.userId).subscribe(response => {
      if (response.status === 'OK') {
        this.lists = response.lists;
      }
    });
  }

  viewReviewDetails(criticId: number) {
    this.router.navigate([`/review/${criticId}`]);
  }

  checkIfAdmin(userId: number | null): void {
    this.roleService.getUserRoles(userId).subscribe(response => {
      this.isAdmin = response.roles.some((role: any) => role.role_name === 'Admin');
    });
  }

  getLikes(critic_id: number) {
    this.likesService.getLikesForReview(critic_id).subscribe(response => {
      if (response.status === 'OK') {
        const likes = response.likes as { like_id: number, critic_id: number, user_id: number, created_at: Date, User: { username: string } }[];
        this.likesCountMap[critic_id] = likes.length;
        this.userLikesMap[critic_id] = likes.some(like => like.user_id === this.currentUserId);
        this.likesUserMap[critic_id] = likes.map(like => ({ user_id: like.user_id, username: like.User.username }));
      }
    });
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
          this.reviews.forEach(review => this.getLikes(review.critic_id));
        }
      });
    }
  }

  toggleLike(critic_id: any) {
    if (this.currentUserId) {
      const hasLiked = this.userLikesMap[critic_id];
      if (hasLiked) {
        this.likesService.unlikeReview(critic_id, this.currentUserId).subscribe(response => {
          if (response.status === 'OK') {
            this.likesCountMap[critic_id] = (this.likesCountMap[critic_id] || 0) - 1;
            this.userLikesMap[critic_id] = false;
            this.getLikes(critic_id); // Refresh likes data
          }
        });
      } else {
        this.likesService.likeReview(critic_id, this.currentUserId).subscribe(response => {
          if (response.status === 'OK') {
            this.likesCountMap[critic_id] = (this.likesCountMap[critic_id] || 0) + 1;
            this.userLikesMap[critic_id] = true;
            this.getLikes(critic_id); // Refresh likes data
          }
        });
      }
    }
  }

  navigateToCreateList() {
    this.router.navigate(['/create-list']);
  }

  toggleHover(critic_id: number, state: boolean) {
    this.hoverState[critic_id] = state;
  }

  loadBookDetails() {
    this.reviews.forEach(review => {
      this.searchService.searchBookById(review.Book.google_books_id).subscribe(book => {
        this.bookDetails[review.Book.book_id] = book;
      });
    });
  }

  isActive(statusId: number): boolean {
    return this.currentStatus === statusId;
  }

  onSelectBookId(id: any) {
    this.router.navigate(['/book', id]);
  }

  onSelectBook(book: any) {
    this.router.navigate(['/book', book.Book.google_books_id]);
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

  viewListDetails(listId: number): void {
    this.router.navigate(['/custom-lists', listId]);
  }

  deleteList(list_id: number) {
    this.customListsService.deleteList(list_id).subscribe(() => {
      this.lists = this.lists.filter(list => list.list_id !== list_id);
    });
  }
}
