import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  @Input() userId: number = 1;
  user: any = {};
  isFollowing: boolean = false;
  currentUserId: number | null = 1;
  isOwnProfile: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.isOwnProfile = this.userId == this.currentUserId;
      this.getUserProfile();
      this.checkIfFollowing();
    });
  }

  getUserProfile(): void {
    this.userService.getUserById(this.userId).subscribe(response => {
      if (response.status === 'OK') {
        this.user = response.user;
      } else {
        console.error('Error fetching user profile:', response);
      }
    }, error => {
      console.error('HTTP error fetching user profile:', error);
    });
  }

  checkIfFollowing(): void {
    this.userService.checkIfFollowing(this.currentUserId, this.userId).subscribe(response => {
      this.isFollowing = response.isFollowing;
    });
  }

  follow(): void {
    this.userService.followUser(this.currentUserId, this.userId).subscribe(() => {
      this.isFollowing = true;
      this.user.followersCount = (this.user.followersCount || 0) + 1; // Update follower count
    });
  }

  unfollow(): void {
    this.userService.unfollowUser(this.currentUserId, this.userId).subscribe(() => {
      this.isFollowing = false;
      this.user.followersCount = (this.user.followersCount || 1) - 1; // Update follower count
    });
  }
}
