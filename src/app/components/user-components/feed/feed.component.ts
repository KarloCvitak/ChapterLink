import {Component, OnInit} from '@angular/core';
import {FollowingService} from "../../../services/portal-services/following.service";
import {AuthService} from "../../../services/auth-services/auth.service";
import {RoleService} from "../../../services/user-services/role.service";
import {CriticService} from "../../../services/portal-services/critic.service";
import {LikeService} from "../../../services/portal-services/like.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user-services/user.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit{


  reviews: any[] = [];
  currentUserId: number | null = null;
  editingReview: any = null;
  userRoles: string[] = [];
  hoverState: any = {};
  bookDetails: any = {};
  isAdmin: boolean = false;
  likesUserMap: { [criticId: number]: any[] } = {};
  likesCountMap: { [criticId: number]: number } = {};
  userLikesMap: { [criticId: number]: boolean } = {};


  constructor(private followingService: FollowingService,
              private authService: AuthService,
              private roleService : RoleService,
              private criticService: CriticService,
              private likesService: LikeService,
              private userService: UserService,

              private router: Router) { }


  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    this.loadReviews();
    this.checkIfAdmin(this.currentUserId);
  }

  viewReviewDetails(criticId: number) {
    this.router.navigate([`/review/${criticId}`]);
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


  loadReviews(): void {
    this.followingService.getReviewsFromFollowedUsers(this.currentUserId).subscribe(
      (data) => {
        this.reviews = data.reviews;
        this.reviews.forEach(review => this.getLikes(review.critic_id));

      },
      (error) => {
        console.error('Error fetching reviews', error);
      }
    );
  }



  checkIfAdmin(userId: number | null): void {
    this.roleService.getUserRoles(userId).subscribe(response => {
      this.isAdmin = response.roles.some((role: any) => role.role_name === 'Admin');
    });
  }

  editReview(review: any): void {
    this.editingReview = { ...review };
  }

  cancelEdit(): void {
    this.editingReview = null;
  }

  updateReview(): void {
    if (this.editingReview) {
      this.criticService.updateCritic(this.editingReview.critic_id, this.editingReview).subscribe(
        (data) => {
          this.loadReviews();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error updating review', error);
        }
      );
    }
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {

      this.likesService.destoryLikesFromAReview(reviewId).subscribe();

      this.criticService.deleteCritic(reviewId).subscribe(
        () => this.loadReviews(),
        (error) => console.error('Error deleting review', error),
      );
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

  toggleHover(critic_id: number, state: boolean) {
    this.hoverState[critic_id] = state;
  }

  canEditOrDelete(review: any): boolean {
    return review.user_id === this.currentUserId || this.userRoles.includes('Admin');
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
  getUserInitials(username: string | null): string {
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';  // Default value if username is null or empty
  }

}

