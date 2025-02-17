import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {AuthenticationGuard} from "./auth/auth.guard";
import {AuthService} from "./services/auth-services/auth.service";
import {AuthModule} from "./auth/auth.module";
import { FeedComponent } from './components/user-components/feed/feed.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavBarComponent } from './components/user-components/nav-bar/nav-bar.component';
import { SearchResultsComponent } from './components/user-components/search-results/search-results.component';
import { SearchBarComponent } from './components/user-components/search-bar/search-bar.component';
import { BookDetailComponent } from './components/user-components/book-detail/book-detail.component';
import { ProfileComponent } from './components/user-components/profile/profile.component';
import { UserProfileInfoComponent } from './components/user-components/user-profile-info/user-profile-info.component';
import { CriticComponent } from './components/user-components/critic/critic.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CriticDetailsComponent } from './components/user-components/critic-details/critic-details.component';
import { CreatingListComponent } from './components/user-components/creating-list/creating-list.component';
import { CustomListsComponent } from './components/user-components/custom-lists/custom-lists.component';
import { UserRoleDashboardComponent } from './components/admin-components/user-role-dashboard/user-role-dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatError, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    NavBarComponent,
    SearchResultsComponent,
    SearchBarComponent,
    BookDetailComponent,
    ProfileComponent,
    UserProfileInfoComponent,
    CriticComponent,
    CriticDetailsComponent,
    CreatingListComponent,
    CustomListsComponent,
    UserRoleDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatError
  ],
  providers: [AuthService,
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
