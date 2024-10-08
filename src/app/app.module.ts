import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {AuthenticationGuard} from "./auth/auth.guard";
import {AuthService} from "./services/auth.service";
import {AuthModule} from "./auth/auth.module";
import { FeedComponent } from './feed/feed.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileInfoComponent } from './user-profile-info/user-profile-info.component';
import { CriticComponent } from './critic/critic.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CriticDetailsComponent } from './critic-details/critic-details.component';
import { CreatingListComponent } from './creating-list/creating-list.component';
import { CustomListsComponent } from './custom-lists/custom-lists.component';
import { UserRoleDashboardComponent } from './user-role-dashboard/user-role-dashboard.component';

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
    FontAwesomeModule
  ],
  providers: [AuthService,
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
