import { Component, Input, OnInit } from '@angular/core';
import { LikeService } from '../services/like.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {
  @Input() criticId!: number;
  @Input() userId!: number;
  liked: boolean = false;

  constructor(private likeService: LikeService) { }

  ngOnInit(): void {
    this.checkLikeStatus();
  }

  checkLikeStatus(): void {
    this.likeService.getLikes(this.criticId, this.userId).subscribe(like => {
      this.liked = !!like;
    });
  }

  toggleLike(): void {
    if (this.liked) {
      this.likeService.unlike(this.criticId, this.userId).subscribe(() => {
        this.liked = false;
      });
    } else {
      this.likeService.like(this.criticId, this.userId).subscribe(() => {
        this.liked = true;
      });
    }
  }
}
