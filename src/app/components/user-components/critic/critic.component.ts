// critic.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CriticService } from '../../../services/portal-services/critic.service';
import { AuthService } from '../../../services/auth-services/auth.service';
import { UserBookService } from '../../../services/portal-services/user-book.service';
import { SearchService } from "../../../services/portal-services/search.service";
import { LikeService } from "../../../services/portal-services/like.service";
import {Router} from "@angular/router";
import {RoleService} from "../../../services/user-services/role.service";
import {UserService} from "../../../services/user-services/user.service";

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
  isAdmin: boolean = false;
  likesCountMap: { [criticId: number]: number } = {};
  userLikesMap: { [criticId: number]: boolean } = {};
  likesUserMap: { [criticId: number]: any[] } = {}; // Map to store users who liked

  hoverState: { [criticId: number]: boolean } = {}; // Manage hover state

  constructor(
    private criticService: CriticService,
    private authService: AuthService,
    private searchService: SearchService,
    private likeService: LikeService,
    private bookService: UserBookService,
    private router: Router,
    private roleService: RoleService,
    private userService: UserService
  ) {}

  getUserInitials(username: string | null): string {
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';  // Default value if username is null or empty
  }
  ngOnInit() {
    this.userId = this.userService.getCurrentUserId();
    this.checkIfAdmin(this.userId);
    this.searchService.searchBookById(this.bookId).subscribe(book => {
      this.book = book;
      this.loadCritics();
      if (this.userId) {
        this.getCurrentStatus();
      }
    });
  }

  checkIfAdmin(userId: number | null): void {
    this.roleService.getUserRoles(userId).subscribe(response => {
      this.isAdmin = response.roles.some((role: any) => role.role_name === 'Admin');
    });
  }


  viewReviewDetails(criticId: number) {
    this.router.navigate([`/review/${criticId}`]);
  }

  getLikes(critic_id: number) {
    this.likeService.getLikesForReview(critic_id).subscribe(response => {
      if (response.status === 'OK') {
        const likes = response.likes as { like_id: number, critic_id: number, user_id: number, created_at: Date, User: { username: string } }[];
        // Initialize maps
        this.likesCountMap[critic_id] = likes.length;

        this.userLikesMap[critic_id] = likes.some(like => like.user_id === this.userId);

        // Map users who liked
        this.likesUserMap[critic_id] = likes.map(like => ({ user_id: like.user_id, username: like.User.username }));
      }
    });
  }

  toggleLike(critic_id: any) {
    if (this.userId) {
      const hasLiked = this.userLikesMap[critic_id];
      if (hasLiked) {
        this.likeService.unlikeReview(critic_id, this.userId).subscribe(response => {
          if (response.status === 'OK') {
            this.likesCountMap[critic_id] = (this.likesCountMap[critic_id] || 0) - 1;
            this.userLikesMap[critic_id] = false;
            this.getLikes(critic_id); // Refresh likes data
          }
        });
      } else {
        this.likeService.likeReview(critic_id, this.userId).subscribe(response => {
          if (response.status === 'OK') {
            this.likesCountMap[critic_id] = (this.likesCountMap[critic_id] || 0) + 1;
            this.userLikesMap[critic_id] = true;
            this.getLikes(critic_id); // Refresh likes data
          }
        });
      }
    }
  }

  loadCritics() {
    this.criticService.getCriticsForBookByGoogleID(this.book.id).subscribe(response => {
      if (response.status === 'OK') {
        this.critics = response.reviews
          .map((critic: any) => ({
            ...critic,
            editMode: false,
            editCriticData: { ...critic }
          }))
          // Sort critics by created_at date
          .sort((a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        // Fetch likes for each critic
        this.critics.forEach(critic => this.getLikes(critic.critic_id));
      }
    });
  }



  addCritic() {
    if (this.userId && this.bookId) {
      this.bookService.addBookToUserStatus(this.userId, this.book, 1).subscribe(() => {
        const criticData = {
          user_id: this.userId,
          google_books_id: this.bookId,
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

  // Toggle hover state
  toggleHover(critic_id: number, state: boolean) {
    this.hoverState[critic_id] = state;
  }
}
