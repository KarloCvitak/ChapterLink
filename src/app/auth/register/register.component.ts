import {AfterViewInit, Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';
import { PasswordMatchValidator } from '../../validators/passwowrd-match.validator';
import {UserService} from "../../services/user-services/user.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent{
  registerForm: FormGroup;
  usernameInUse = false;
  emailInUse = false;


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private renderer: Renderer2) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: PasswordMatchValidator }); // Apply the validator here

  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      // Check username and email availability
      this.userService.checkUsernameEmail(username, email).subscribe(response => {
        this.usernameInUse = response.usernameInUse;
        this.emailInUse = response.emailInUse;

        if (!this.usernameInUse && !this.emailInUse) {
          this.authService.register({ username, email, password }).subscribe(
            (registerResponse) => {
              console.log('Registration successful:', registerResponse);
              this.router.navigate(['/login']); // Navigate to login page upon successful registration
            },
            error => {
              console.error('Registration error:', error);
              // Handle registration error
            }
          );
        }
      }, error => {
        console.error('Username/email availability check error:', error);
        // Handle check error
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
