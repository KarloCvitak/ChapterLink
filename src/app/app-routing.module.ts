import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationGuard} from "./auth/auth.guard";
import {FeedComponent} from "./feed/feed.component";
import {SearchResultsComponent} from "./search-results/search-results.component";
import {BookDetailComponent} from "./book-detail/book-detail.component";
import {ProfileComponent} from "./profile/profile.component";
import {CriticDetailsComponent} from "./critic-details/critic-details.component";
import {CreatingListComponent} from "./creating-list/creating-list.component";
import {CustomListsService} from "./services/custom-lists.service";
import {CustomListsComponent} from "./custom-lists/custom-lists.component";
import {UserRoleDashboardComponent} from "./user-role-dashboard/user-role-dashboard.component";

const routes: Routes = [
  { path: '', component: FeedComponent, canActivate: [AuthenticationGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'search', component: SearchResultsComponent, canActivate: [AuthenticationGuard] },
  { path: 'book/:id', component: BookDetailComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile', redirectTo: '/profile/default', pathMatch: 'full' },
  { path: 'profile/default', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'review/:id', component: CriticDetailsComponent,canActivate: [AuthenticationGuard] },
  { path: 'create-list', component: CreatingListComponent, canActivate: [AuthenticationGuard]  },
  { path: 'custom-lists/:id', component: CustomListsComponent, canActivate: [AuthenticationGuard]  },
  { path: 'user-role-dashboard', component: UserRoleDashboardComponent, canActivate: [AuthenticationGuard]  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
