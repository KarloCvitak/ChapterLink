import { Component, OnInit } from '@angular/core';
import { CriticService } from '../../../services/portal-services/critic.service';
import { AuthService } from '../../../services/auth-services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { SearchService } from '../../../services/portal-services/search.service';
import { CommentService } from '../../../services/portal-services/comment.service';
import {LikeService} from "../../../services/portal-services/like.service";
import {RoleService} from "../../../services/user-services/role.service";
import {UserService} from "../../../services/user-services/user.service";

@Component({
  selector: 'app-critic-details',
  templateUrl: './critic-details.component.html',
  styleUrls: ['./critic-details.component.css']
})
export class CriticDetailsComponent implements OnInit {
  userId: number | null = null;
  review: any = null;
  book: any = null;
  editingReview: any = null;

  comments: any[] = [];
  newComment: string = '';
  editingComment: any = null;

  likesCountMap: { [criticId: number]: number } = {};
  userLikesMap: { [criticId: number]: boolean } = {};
  likesUserMap: { [criticId: number]: any[] } = {}; // Map to store users who liked
  bookDetails: any = {}; // To store book details
  currentUserId: number | null = null;
  isAdmin: boolean = false;

// Manage hover state
  hoverState: { [criticId: number]: boolean } = {}; // Toggle hover state

  constructor(
    private criticService: CriticService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private commentService: CommentService,
    private likesService: LikeService,
    private router: Router,
    private roleService: RoleService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getCurrentUserId();
    this.checkIfAdmin(this.userId);
    const criticId: number | null = Number(this.route.snapshot.paramMap.get('id'));
    if (criticId) {
      this.loadReviewDetails(criticId);
      this.loadComments(criticId);
      this.loadBookDetails(this.review.Book.google_books_id);
    }
  }

  checkIfAdmin(userId: number | null): void {
    this.roleService.getUserRoles(userId).subscribe(response => {
      this.isAdmin = response.roles.some((role: any) => role.role_name === 'Admin');
    });
  }

  viewReviewDetails(criticId: number) {
    this.router.navigate([`/review/${criticId}`]);
  }

  loadReviewDetails(criticId: number) {
    this.criticService.getCriticById(criticId).subscribe(response => {
      if (response.status === 'OK') {
        this.review = response.review;
        this.loadBookDetails(this.review.Book.google_books_id);
        this.getLikes(this.review.critic_id);
      }
    });
  }

  loadBookDetails(googleBooksId: string) {
    this.searchService.searchBookById(googleBooksId).subscribe(book => {
      this.book = book;
    });
  }

  editReview(review: any) {
    this.editingReview = { ...review };
  }

  updateReview() {
    if (this.editingReview) {
      this.criticService.updateCritic(this.editingReview.critic_id, this.editingReview).subscribe(response => {
        if (response.status === 'OK') {
          this.loadReviewDetails(this.editingReview.critic_id);
          this.editingReview = null;
        }
      });
    }

  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {

      this.likesService.destoryLikesFromAReview(reviewId).subscribe();
      this.criticService.deleteCritic(reviewId).subscribe(
        () =>   this.router.navigate(['',])
      );
    }
  }

  cancelEdit() {
    this.editingReview = null;
  }


  getLikes(critic_id: number) {
    this.likesService.getLikesForReview(critic_id).subscribe(response => {
      if (response.status === 'OK') {
        const likes = response.likes as { like_id: number, critic_id: number, user_id: number, created_at: Date, User: { username: string } }[];
        this.likesCountMap[critic_id] = likes.length;
        this.userLikesMap[critic_id] = likes.some(like => like.user_id === this.userId);
        this.likesUserMap[critic_id] = likes.map(like => ({ user_id: like.user_id, username: like.User.username }));
      }
    });
  }

  toggleLike(critic_id: any) {
    if (this.userId) {
      const hasLiked = this.userLikesMap[critic_id];
      if (hasLiked) {
        this.likesService.unlikeReview(critic_id, this.userId).subscribe(response => {
          if (response.status === 'OK') {
            this.likesCountMap[critic_id] = (this.likesCountMap[critic_id] || 0) - 1;
            this.userLikesMap[critic_id] = false;
            this.getLikes(critic_id); // Refresh likes data
          }
        });
      } else {
        this.likesService.likeReview(critic_id, this.userId).subscribe(response => {
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

  loadComments(criticId: number) {
    this.commentService.getCommentsForReview(criticId).subscribe(response => {
      if (response.status === 'OK') {
        this.comments = response.comments;
        this.sortComments(); // Sort comments after loading
      }
    });
  }

  addComment() {
    const comment = {
      user_id: this.userId,
      comment_text: this.newComment,
      created_at: new Date(),
      critic_id: this.review.critic_id
    };

    this.commentService.addComment(comment).subscribe(response => {
      if (response.status === 'OK') {
        this.comments.push(response.comment);
        this.newComment = '';
        this.loadComments(this.review.critic_id);
        this.sortComments(); // Sort comments after adding
      }
    });
  }

  editComment(comment: any) {
    this.editingComment = { ...comment };
  }

  updateComment() {
    if (this.editingComment) {
      this.commentService.updateComment(this.editingComment.comment_id, this.editingComment).subscribe(response => {
        if (response.status === 'OK') {
          const index = this.comments.findIndex(c => c.comment_id === this.editingComment.comment_id);
          if (index !== -1) {
            this.comments[index] = this.editingComment;
            this.sortComments(); // Sort comments after updating
          }
          this.editingComment = null;
        }
      });
    }
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(response => {
      if (response.status === 'OK') {
        this.comments = this.comments.filter(c => c.comment_id !== commentId);
        this.sortComments(); // Sort comments after deleting
      }
    });
  }

  cancelEditComments() {
    this.editingComment = null;
  }

  // Method to sort comments by created_at in descending order
  sortComments() {
    this.comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getUserInitials(username: string | null): string {
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';  // Default value if username is null or empty
  }
}
