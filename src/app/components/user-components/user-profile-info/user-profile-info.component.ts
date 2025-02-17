import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../../../services/auth-services/auth.service";

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
  isEditing: boolean = false;
  newUsername: string = '';

  constructor(private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
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

  getUserInitials(username: string | null): string {
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';  // Default value if username is null or empty
  }

  toggleEdit(show: boolean = true): void {
    this.isEditing = show;
    if (!show) {
      this.newUsername = ''; // Clear new username when hiding the form
    }
  }


  updateUsername(): void {
    this.userService.checkUsernameEmail(this.newUsername, this.user.email).subscribe(response => {
      if (!response.usernameInUse) {
        // Proceed with updating username
        this.userService.updateUsername(this.currentUserId, this.newUsername).subscribe(() => {
          this.user.username = this.newUsername;
          this.toggleEdit(false); // Hide form after updating
        }, error => {
          console.error('Error updating username:', error);
        });
      } else {
        // Handle case where username is already in use
        alert('Username is already taken.');
      }
    });
  }

}
