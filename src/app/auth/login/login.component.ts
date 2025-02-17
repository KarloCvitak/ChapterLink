import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';
import {TokenService} from "../../services/auth-services/token.service";
import {LikeService} from "../../services/portal-services/like.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';

  ngOnInit() {
  console.log(this.likeService.getTopLikes());
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private tokenService: TokenService,
              private router: Router,
              private likeService: LikeService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Form Submitted', this.loginForm.value);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(response => {
        if (response && response.token) {
          this.tokenService.setToken(response.token);
          this.router.navigate(['']);
        } else {
          this.errorMessage = 'Invalid login response';
          console.error('Invalid login response', response);
        }
      }, error => {
        this.errorMessage = 'Incorrect email or password. Please try again.';
        console.error('Login error', error);
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
