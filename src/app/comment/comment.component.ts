import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() criticId!: number;
  comments: any[] = [];
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private commentService: CommentService) {
    this.commentForm = this.fb.group({
      comment_text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.commentService.getComments(this.criticId).subscribe(comments => {
      this.comments = comments;
    });
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      const comment = {
        ...this.commentForm.value,
        critic_id: this.criticId
      };
      this.commentService.addComment(comment).subscribe(() => {
        this.fetchComments();
        this.commentForm.reset();
      });
    }
  }
}
